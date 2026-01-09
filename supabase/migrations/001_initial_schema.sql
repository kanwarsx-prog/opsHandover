-- ============================================
-- OPSHANDOVER DATABASE SCHEMA
-- Supabase PostgreSQL Migration
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: handovers
-- ============================================
CREATE TABLE handovers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  lead TEXT NOT NULL,
  owner TEXT NOT NULL,
  target_date DATE,
  status TEXT NOT NULL CHECK (status IN ('Ready', 'At Risk', 'Not Ready')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: domains
-- ============================================
CREATE TABLE domains (
  id BIGSERIAL PRIMARY KEY,
  handover_id BIGINT NOT NULL REFERENCES handovers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: checks
-- ============================================
CREATE TABLE checks (
  id BIGSERIAL PRIMARY KEY,
  domain_id BIGINT NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Ready', 'At Risk', 'Not Ready')),
  owner TEXT NOT NULL,
  blocker_reason TEXT,
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: approvals
-- ============================================
CREATE TABLE approvals (
  id BIGSERIAL PRIMARY KEY,
  check_id BIGINT NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
  approver TEXT NOT NULL,
  role TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  comments TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: evidence
-- ============================================
CREATE TABLE evidence (
  id BIGSERIAL PRIMARY KEY,
  check_id BIGINT NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'link', 'screenshot', 'video')),
  description TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_domains_handover ON domains(handover_id);
CREATE INDEX idx_checks_domain ON checks(domain_id);
CREATE INDEX idx_approvals_check ON approvals(check_id);
CREATE INDEX idx_evidence_check ON evidence(check_id);
CREATE INDEX idx_handovers_status ON handovers(status);
CREATE INDEX idx_checks_status ON checks(status);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to handovers
CREATE TRIGGER update_handovers_updated_at
    BEFORE UPDATE ON handovers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to checks
CREATE TRIGGER update_checks_updated_at
    BEFORE UPDATE ON checks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- For anonymous access, we'll enable RLS but allow all operations
-- ============================================
ALTER TABLE handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for now (public access)
CREATE POLICY "Allow anonymous access to handovers" ON handovers FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to domains" ON domains FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to checks" ON checks FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to approvals" ON approvals FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to evidence" ON evidence FOR ALL USING (true);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE handovers IS 'Main handover projects/workspaces';
COMMENT ON TABLE domains IS 'Readiness domains within a handover (e.g., People, Process, Technology)';
COMMENT ON TABLE checks IS 'Individual readiness checks within a domain';
COMMENT ON TABLE approvals IS 'Approval records for checks requiring formal sign-off';
COMMENT ON TABLE evidence IS 'Evidence attachments/links for checks';

COMMENT ON COLUMN checks.requires_approval IS 'Whether this check requires formal approval';
COMMENT ON COLUMN checks.approval_status IS 'Current approval status if requires_approval is true';
COMMENT ON COLUMN approvals.decision IS 'Approval decision: approved or rejected';
COMMENT ON COLUMN evidence.type IS 'Type of evidence: document, link, screenshot, or video';
