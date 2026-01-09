/**
 * Domain Templates for Different Handover Types
 * Each template includes domains and their associated checks
 */

export const domainTemplates = {
    cloud: [
        {
            title: 'Technology & Infrastructure',
            checks: [
                { title: 'Infrastructure Provisioned & Tested', owner: 'TBD' },
                { title: 'Monitoring & Alerting Configured', owner: 'TBD' },
                { title: 'Backup & DR Strategy Validated', owner: 'TBD' },
                { title: 'Performance Baselines Established', owner: 'TBD' },
                { title: 'Capacity Planning Completed', owner: 'TBD' },
                { title: 'Network & Firewall Rules Configured', owner: 'TBD' }
            ]
        },
        {
            title: 'Security & Compliance',
            checks: [
                { title: 'Security Review Completed', owner: 'TBD', requiresApproval: true },
                { title: 'Penetration Testing Sign-off', owner: 'TBD', requiresApproval: true },
                { title: 'Vulnerability Scan Passed', owner: 'TBD' },
                { title: 'Access Controls Configured', owner: 'TBD' },
                { title: 'Encryption at Rest & Transit Enabled', owner: 'TBD' },
                { title: 'Compliance Requirements Met', owner: 'TBD', requiresApproval: true }
            ]
        },
        {
            title: 'Operations & Support',
            checks: [
                { title: 'Runbooks Documented & Tested', owner: 'TBD' },
                { title: 'Support Rota Established', owner: 'TBD' },
                { title: 'Incident Response Plan Defined', owner: 'TBD' },
                { title: 'Escalation Paths Documented', owner: 'TBD' },
                { title: 'On-Call Coverage Confirmed', owner: 'TBD' },
                { title: 'Knowledge Transfer Completed', owner: 'TBD' }
            ]
        },
        {
            title: 'People & Training',
            checks: [
                { title: 'Operations Team Training Completed', owner: 'TBD' },
                { title: 'Support Team Training Completed', owner: 'TBD' },
                { title: 'User Documentation Published', owner: 'TBD' },
                { title: 'BAU Team Confidence Validated', owner: 'TBD' }
            ]
        }
    ],

    product: [
        {
            title: 'Product & Engineering',
            checks: [
                { title: 'Feature Development Complete', owner: 'TBD' },
                { title: 'Code Review & QA Passed', owner: 'TBD' },
                { title: 'Performance Testing Completed', owner: 'TBD' },
                { title: 'Feature Flags Configured', owner: 'TBD' },
                { title: 'Rollback Plan Tested', owner: 'TBD' },
                { title: 'API Documentation Updated', owner: 'TBD' }
            ]
        },
        {
            title: 'Customer Success',
            checks: [
                { title: 'Customer Communication Plan Ready', owner: 'TBD' },
                { title: 'Help Center Articles Published', owner: 'TBD' },
                { title: 'CS Team Training Completed', owner: 'TBD' },
                { title: 'Beta Testing Feedback Incorporated', owner: 'TBD' },
                { title: 'Customer Onboarding Materials Ready', owner: 'TBD' }
            ]
        },
        {
            title: 'Operations & Monitoring',
            checks: [
                { title: 'Monitoring Dashboards Created', owner: 'TBD' },
                { title: 'Alerts & Thresholds Configured', owner: 'TBD' },
                { title: 'Incident Runbooks Documented', owner: 'TBD' },
                { title: 'Support Escalation Path Defined', owner: 'TBD' },
                { title: 'Analytics & Metrics Tracking Setup', owner: 'TBD' }
            ]
        },
        {
            title: 'Compliance & Security',
            checks: [
                { title: 'Security Review Completed', owner: 'TBD', requiresApproval: true },
                { title: 'Privacy Impact Assessment', owner: 'TBD', requiresApproval: true },
                { title: 'Data Protection Compliance Verified', owner: 'TBD' },
                { title: 'Accessibility Standards Met', owner: 'TBD' }
            ]
        }
    ],

    legacy: [
        {
            title: 'Decommission Planning',
            checks: [
                { title: 'Decommission Plan Approved', owner: 'TBD', requiresApproval: true },
                { title: 'Stakeholder Communication Complete', owner: 'TBD' },
                { title: 'Dependencies Identified & Mitigated', owner: 'TBD' },
                { title: 'Rollback Plan Documented', owner: 'TBD' },
                { title: 'Timeline & Milestones Agreed', owner: 'TBD' }
            ]
        },
        {
            title: 'Data Migration & Archival',
            checks: [
                { title: 'Data Migration Plan Approved', owner: 'TBD', requiresApproval: true },
                { title: 'Data Backup Completed', owner: 'TBD' },
                { title: 'Data Archival Strategy Defined', owner: 'TBD' },
                { title: 'Data Retention Policy Confirmed', owner: 'TBD' },
                { title: 'Data Validation Completed', owner: 'TBD' }
            ]
        },
        {
            title: 'User Communication & Support',
            checks: [
                { title: 'User Communication Sent', owner: 'TBD' },
                { title: 'Alternative Solutions Documented', owner: 'TBD' },
                { title: 'Support Plan for Transition Period', owner: 'TBD' },
                { title: 'FAQ & Help Documentation Published', owner: 'TBD' }
            ]
        },
        {
            title: 'Technical Decommission',
            checks: [
                { title: 'Infrastructure Shutdown Plan', owner: 'TBD' },
                { title: 'Access Revocation Completed', owner: 'TBD' },
                { title: 'License & Subscription Cancellation', owner: 'TBD' },
                { title: 'Cost Savings Validated', owner: 'TBD' }
            ]
        }
    ],

    human: [
        {
            title: 'People & Training',
            checks: [
                { title: 'Training Materials Developed', owner: 'TBD' },
                { title: 'Training Sessions Delivered', owner: 'TBD' },
                { title: 'Team Competency Validated', owner: 'TBD' },
                { title: 'Change Champions Identified', owner: 'TBD' },
                { title: 'Stakeholder Buy-in Achieved', owner: 'TBD' }
            ]
        },
        {
            title: 'Process Documentation',
            checks: [
                { title: 'Process Documentation Complete', owner: 'TBD' },
                { title: 'Standard Operating Procedures Published', owner: 'TBD' },
                { title: 'Workflow Diagrams Created', owner: 'TBD' },
                { title: 'Process Ownership Assigned', owner: 'TBD' },
                { title: 'Quality Standards Defined', owner: 'TBD' }
            ]
        },
        {
            title: 'Change Management',
            checks: [
                { title: 'Change Impact Assessment Completed', owner: 'TBD', requiresApproval: true },
                { title: 'Communication Plan Executed', owner: 'TBD' },
                { title: 'Resistance Management Strategy', owner: 'TBD' },
                { title: 'Feedback Mechanisms Established', owner: 'TBD' },
                { title: 'Success Metrics Defined', owner: 'TBD' }
            ]
        },
        {
            title: 'Support & Sustainability',
            checks: [
                { title: 'Support Model Defined', owner: 'TBD' },
                { title: 'Continuous Improvement Plan', owner: 'TBD' },
                { title: 'Performance Monitoring Setup', owner: 'TBD' },
                { title: 'Escalation Process Documented', owner: 'TBD' }
            ]
        }
    ]
};

/**
 * Get template by handover type
 * @param {string} type - Handover type (cloud, product, legacy, human)
 * @returns {Array} Domain template array
 */
export const getTemplate = (type) => {
    return domainTemplates[type] || domainTemplates.cloud;
};

/**
 * Get template summary for preview
 * @param {string} type - Handover type
 * @returns {Object} Summary with domain count and check count
 */
export const getTemplateSummary = (type) => {
    const template = getTemplate(type);
    const totalChecks = template.reduce((sum, domain) => sum + domain.checks.length, 0);

    return {
        domainCount: template.length,
        checkCount: totalChecks,
        domains: template.map(d => ({
            title: d.title,
            checkCount: d.checks.length
        }))
    };
};
