-- Data Migration: Seed System Templates
-- Description: Populate template_libraries with existing domain templates
-- Run after: 002_enhancements_phase1.sql

-- This script migrates the existing templates from domainTemplates.js into the database

DO $$
DECLARE
    v_cloud_template_id BIGINT;
    v_saas_template_id BIGINT;
    v_legacy_template_id BIGINT;
    v_process_template_id BIGINT;
    
    v_domain_id BIGINT;
BEGIN
    -- Delete existing system templates to make this migration idempotent
    DELETE FROM template_libraries WHERE category = 'system';

    -- First, create the template records
    INSERT INTO template_libraries (name, description, category, is_public, created_by)
    VALUES 
        ('Cloud / Infrastructure', 'Comprehensive checklist for cloud infrastructure migrations and deployments', 'system', true, 'system'),
        ('SaaS Product Feature', 'End-to-end readiness for SaaS product feature launches', 'system', true, 'system'),
        ('Legacy Decommission', 'Structured approach to safely decommissioning legacy systems', 'system', true, 'system'),
        ('Process / People Change', 'Change management checklist for organizational transformations', 'system', true, 'system');

    -- Get template IDs
    SELECT id INTO v_cloud_template_id FROM template_libraries WHERE name = 'Cloud / Infrastructure';
    SELECT id INTO v_saas_template_id FROM template_libraries WHERE name = 'SaaS Product Feature';
    SELECT id INTO v_legacy_template_id FROM template_libraries WHERE name = 'Legacy Decommission';
    SELECT id INTO v_process_template_id FROM template_libraries WHERE name = 'Process / People Change';

    -- ========================================================================
    -- CLOUD / INFRASTRUCTURE TEMPLATE
    -- ========================================================================
    
    -- Technology & Infrastructure
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_cloud_template_id, 'Technology & Infrastructure', 'Core technical components and infrastructure readiness', 1)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Infrastructure provisioned and tested', 'DevOps Team', false, 1),
        (v_domain_id, 'Network configuration validated', 'Network Team', false, 2),
        (v_domain_id, 'Load balancing configured', 'Platform Team', false, 3),
        (v_domain_id, 'Auto-scaling policies defined', 'Platform Team', false, 4),
        (v_domain_id, 'Disaster recovery plan tested', 'DevOps Team', true, 5),
        (v_domain_id, 'Backup and restore procedures validated', 'DevOps Team', true, 6);
    
    -- Security & Compliance
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_cloud_template_id, 'Security & Compliance', 'Security controls and compliance requirements', 2)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Security audit completed', 'Security Team', true, 1),
        (v_domain_id, 'Penetration testing passed', 'Security Team', true, 2),
        (v_domain_id, 'Access controls configured', 'Security Team', true, 3),
        (v_domain_id, 'Encryption at rest enabled', 'Security Team', false, 4),
        (v_domain_id, 'Encryption in transit enabled', 'Security Team', false, 5),
        (v_domain_id, 'Compliance requirements met', 'Compliance Team', true, 6);
    
    -- Operations & Support
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_cloud_template_id, 'Operations & Support', 'Operational readiness and support capabilities', 3)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Monitoring and alerting configured', 'SRE Team', false, 1),
        (v_domain_id, 'Logging aggregation setup', 'SRE Team', false, 2),
        (v_domain_id, 'Runbooks documented', 'Operations Team', false, 3),
        (v_domain_id, 'On-call rotation established', 'Operations Team', false, 4),
        (v_domain_id, 'Incident response plan tested', 'Operations Team', false, 5),
        (v_domain_id, 'SLA/SLO targets defined', 'Product Team', false, 6);
    
    -- People & Training
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_cloud_template_id, 'People & Training', 'Team readiness and knowledge transfer', 4)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Operations team trained', 'Training Lead', false, 1),
        (v_domain_id, 'Knowledge base articles created', 'Tech Writer', false, 2),
        (v_domain_id, 'Support team briefed', 'Support Manager', false, 3),
        (v_domain_id, 'Stakeholder communication sent', 'Project Manager', false, 4);

    -- ========================================================================
    -- SAAS PRODUCT FEATURE TEMPLATE
    -- ========================================================================
    
    -- Product & Engineering
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_saas_template_id, 'Product & Engineering', 'Feature development and technical readiness', 1)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Feature development complete', 'Engineering Lead', false, 1),
        (v_domain_id, 'Code review passed', 'Tech Lead', false, 2),
        (v_domain_id, 'Unit tests passing (>80% coverage)', 'Engineering Team', false, 3),
        (v_domain_id, 'Integration tests passing', 'QA Team', false, 4),
        (v_domain_id, 'Performance benchmarks met', 'Engineering Team', false, 5),
        (v_domain_id, 'Feature flags configured', 'DevOps Team', false, 6);
    
    -- Customer Success
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_saas_template_id, 'Customer Success', 'Customer-facing readiness', 2)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'User documentation completed', 'Tech Writer', false, 1),
        (v_domain_id, 'In-app help content added', 'Product Team', false, 2),
        (v_domain_id, 'Customer support trained', 'CS Manager', false, 3),
        (v_domain_id, 'Beta testing completed', 'Product Manager', false, 4),
        (v_domain_id, 'Customer communication drafted', 'Marketing Team', false, 5);
    
    -- Operations & Monitoring
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_saas_template_id, 'Operations & Monitoring', 'Operational monitoring and support', 3)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Feature metrics dashboard created', 'Analytics Team', false, 1),
        (v_domain_id, 'Error tracking configured', 'Engineering Team', false, 2),
        (v_domain_id, 'Usage analytics instrumented', 'Analytics Team', false, 3),
        (v_domain_id, 'Rollback plan documented', 'DevOps Team', false, 4),
        (v_domain_id, 'Gradual rollout plan approved', 'Product Manager', true, 5);
    
    -- Compliance & Security
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_saas_template_id, 'Compliance & Security', 'Security and compliance validation', 4)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Security review completed', 'Security Team', true, 1),
        (v_domain_id, 'Privacy impact assessment done', 'Legal Team', true, 2),
        (v_domain_id, 'Data retention policies configured', 'Compliance Team', false, 3),
        (v_domain_id, 'Terms of service updated (if needed)', 'Legal Team', false, 4);

    -- ========================================================================
    -- LEGACY DECOMMISSION TEMPLATE
    -- ========================================================================
    
    -- Decommission Planning
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_legacy_template_id, 'Decommission Planning', 'Planning and preparation for decommissioning', 1)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Dependency mapping completed', 'Architecture Team', false, 1),
        (v_domain_id, 'Impact analysis documented', 'Project Manager', false, 2),
        (v_domain_id, 'Stakeholder approval obtained', 'Program Manager', true, 3),
        (v_domain_id, 'Decommission timeline finalized', 'Project Manager', false, 4),
        (v_domain_id, 'Rollback plan prepared', 'Operations Team', false, 5);
    
    -- Data Migration & Archival
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_legacy_template_id, 'Data Migration & Archival', 'Data handling and preservation', 2)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Data migration completed', 'Data Team', false, 1),
        (v_domain_id, 'Data validation passed', 'Data Team', false, 2),
        (v_domain_id, 'Archival strategy approved', 'Compliance Team', true, 3),
        (v_domain_id, 'Historical data archived', 'Data Team', false, 4),
        (v_domain_id, 'Data retention policies applied', 'Legal Team', false, 5);
    
    -- User Communication & Support
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_legacy_template_id, 'User Communication & Support', 'User transition and support', 3)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'User notification sent', 'Communications Team', false, 1),
        (v_domain_id, 'Alternative solutions documented', 'Product Team', false, 2),
        (v_domain_id, 'Support team briefed', 'Support Manager', false, 3),
        (v_domain_id, 'FAQ published', 'Tech Writer', false, 4);
    
    -- Technical Decommission
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_legacy_template_id, 'Technical Decommission', 'System shutdown and cleanup', 4)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Integrations disabled', 'Engineering Team', false, 1),
        (v_domain_id, 'Access revoked', 'Security Team', false, 2),
        (v_domain_id, 'Infrastructure deprovisioned', 'DevOps Team', false, 3),
        (v_domain_id, 'DNS records updated', 'Network Team', false, 4);

    -- ========================================================================
    -- PROCESS / PEOPLE CHANGE TEMPLATE
    -- ========================================================================
    
    -- People & Training
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_process_template_id, 'People & Training', 'Team preparation and training', 1)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Training materials developed', 'Training Lead', false, 1),
        (v_domain_id, 'Training sessions delivered', 'Training Team', false, 2),
        (v_domain_id, 'Champions identified and trained', 'Change Manager', false, 3),
        (v_domain_id, 'Feedback mechanism established', 'HR Team', false, 4),
        (v_domain_id, 'Competency assessments completed', 'Training Lead', false, 5);
    
    -- Process Documentation
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_process_template_id, 'Process Documentation', 'Process definition and documentation', 2)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'New process documented', 'Process Owner', false, 1),
        (v_domain_id, 'Process workflows mapped', 'Business Analyst', false, 2),
        (v_domain_id, 'Standard operating procedures created', 'Operations Team', false, 3),
        (v_domain_id, 'Process metrics defined', 'Process Owner', false, 4),
        (v_domain_id, 'Documentation published', 'Tech Writer', false, 5);
    
    -- Change Management
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_process_template_id, 'Change Management', 'Change rollout and adoption', 3)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Change impact assessment completed', 'Change Manager', false, 1),
        (v_domain_id, 'Stakeholder communication plan executed', 'Communications Team', false, 2),
        (v_domain_id, 'Resistance management plan in place', 'Change Manager', false, 3),
        (v_domain_id, 'Executive sponsorship confirmed', 'Program Manager', true, 4),
        (v_domain_id, 'Go-live readiness review completed', 'Steering Committee', false, 5);
    
    -- Support & Sustainability
    INSERT INTO template_domains (template_id, title, description, order_index)
    VALUES (v_process_template_id, 'Support & Sustainability', 'Ongoing support and continuous improvement', 4)
    RETURNING id INTO v_domain_id;
    
    INSERT INTO template_checks (domain_id, title, owner_placeholder, requires_approval, order_index) VALUES
        (v_domain_id, 'Support model defined', 'Support Manager', false, 1),
        (v_domain_id, 'Help desk trained', 'Support Team', false, 2),
        (v_domain_id, 'Continuous improvement plan established', 'Process Owner', false, 3),
        (v_domain_id, 'Post-implementation review scheduled', 'Project Manager', false, 4);

END $$;
