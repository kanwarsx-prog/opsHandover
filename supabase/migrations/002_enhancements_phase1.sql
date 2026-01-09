-- Migration: 002_enhancements_phase1.sql
-- Description: Add template libraries, analytics tracking, and enhanced evidence support
-- Date: 2026-01-09

-- ============================================================================
-- 1. TEMPLATE LIBRARIES
-- ============================================================================

-- Template library table
CREATE TABLE IF NOT EXISTS template_libraries (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('system', 'organization', 'user')),
    is_public BOOLEAN DEFAULT false,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template domains
CREATE TABLE IF NOT EXISTS template_domains (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT REFERENCES template_libraries(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template checks
CREATE TABLE IF NOT EXISTS template_checks (
    id BIGSERIAL PRIMARY KEY,
    domain_id BIGINT REFERENCES template_domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    owner_placeholder TEXT,
    requires_approval BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for template queries
CREATE INDEX IF NOT EXISTS idx_template_libraries_category ON template_libraries(category);
CREATE INDEX IF NOT EXISTS idx_template_libraries_public ON template_libraries(is_public);
CREATE INDEX IF NOT EXISTS idx_template_domains_template ON template_domains(template_id);
CREATE INDEX IF NOT EXISTS idx_template_checks_domain ON template_checks(domain_id);

-- ============================================================================
-- 2. ANALYTICS & REPORTING
-- ============================================================================

-- Track handover status changes over time
CREATE TABLE IF NOT EXISTS handover_history (
    id BIGSERIAL PRIMARY KEY,
    handover_id BIGINT REFERENCES handovers(id) ON DELETE CASCADE,
    score INTEGER,
    ready_count INTEGER,
    at_risk_count INTEGER,
    not_ready_count INTEGER,
    total_checks INTEGER,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_handover_history_handover_date 
    ON handover_history(handover_id, recorded_at DESC);

-- Function to calculate handover metrics
CREATE OR REPLACE FUNCTION calculate_handover_metrics(p_handover_id BIGINT)
RETURNS TABLE (
    score INTEGER,
    ready_count INTEGER,
    at_risk_count INTEGER,
    not_ready_count INTEGER,
    total_checks INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.score,
        COUNT(CASE WHEN c.status = 'Ready' THEN 1 END)::INTEGER as ready_count,
        COUNT(CASE WHEN c.status = 'At Risk' THEN 1 END)::INTEGER as at_risk_count,
        COUNT(CASE WHEN c.status = 'Not Ready' THEN 1 END)::INTEGER as not_ready_count,
        COUNT(c.id)::INTEGER as total_checks
    FROM handovers h
    LEFT JOIN domains d ON d.handover_id = h.id
    LEFT JOIN checks c ON c.domain_id = d.id
    WHERE h.id = p_handover_id
    GROUP BY h.id, h.score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. ENHANCED EVIDENCE
-- ============================================================================

-- Add new columns to evidence table
ALTER TABLE evidence 
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS file_size BIGINT,
    ADD COLUMN IF NOT EXISTS file_type TEXT,
    ADD COLUMN IF NOT EXISTS uploaded_by TEXT,
    ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW();

-- Create GIN index for tag searches
CREATE INDEX IF NOT EXISTS idx_evidence_tags ON evidence USING GIN(tags);

-- Create index for file type filtering
CREATE INDEX IF NOT EXISTS idx_evidence_file_type ON evidence(file_type);

-- ============================================================================
-- 4. TRIGGERS & AUTOMATION
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_libraries_updated_at
    BEFORE UPDATE ON template_libraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE template_libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE handover_history ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous access (matching existing pattern)
CREATE POLICY "Allow anonymous read access to public templates"
    ON template_libraries FOR SELECT
    USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow anonymous full access to templates"
    ON template_libraries FOR ALL
    USING (true);

CREATE POLICY "Allow anonymous full access to template domains"
    ON template_domains FOR ALL
    USING (true);

CREATE POLICY "Allow anonymous full access to template checks"
    ON template_checks FOR ALL
    USING (true);

CREATE POLICY "Allow anonymous full access to handover history"
    ON handover_history FOR ALL
    USING (true);

-- ============================================================================
-- 6. SEED SYSTEM TEMPLATES
-- ============================================================================

-- Insert existing templates as system templates
INSERT INTO template_libraries (name, description, category, is_public, created_by)
VALUES 
    ('Cloud / Infrastructure', 'Comprehensive checklist for cloud infrastructure migrations and deployments', 'system', true, 'system'),
    ('SaaS Product Feature', 'End-to-end readiness for SaaS product feature launches', 'system', true, 'system'),
    ('Legacy Decommission', 'Structured approach to safely decommissioning legacy systems', 'system', true, 'system'),
    ('Process / People Change', 'Change management checklist for organizational transformations', 'system', true, 'system')
ON CONFLICT DO NOTHING;

-- Note: Domain and check seeding will be handled by a separate data migration script
-- to avoid duplicating the template data already in domainTemplates.js

-- ============================================================================
-- 7. HELPER FUNCTIONS
-- ============================================================================

-- Function to record daily handover snapshot
CREATE OR REPLACE FUNCTION record_handover_snapshot(p_handover_id BIGINT)
RETURNS void AS $$
DECLARE
    v_metrics RECORD;
BEGIN
    -- Calculate current metrics
    SELECT * INTO v_metrics FROM calculate_handover_metrics(p_handover_id);
    
    -- Insert snapshot
    INSERT INTO handover_history (
        handover_id,
        score,
        ready_count,
        at_risk_count,
        not_ready_count,
        total_checks
    ) VALUES (
        p_handover_id,
        v_metrics.score,
        v_metrics.ready_count,
        v_metrics.at_risk_count,
        v_metrics.not_ready_count,
        v_metrics.total_checks
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE template_libraries IS 'Stores reusable handover templates';
COMMENT ON TABLE template_domains IS 'Domains within templates';
COMMENT ON TABLE template_checks IS 'Checks within template domains';
COMMENT ON TABLE handover_history IS 'Time-series data for analytics';
