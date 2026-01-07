export const mockHandovers = [
    {
        id: 6,
        name: "Supplier Excellence",
        description: "Comprehensive supplier management transformation across three phases: External Portal, Performance Management, and Segmentation capabilities.",
        lead: "Jennifer Martinez",
        owner: "Procurement Director",
        targetDate: "2026-07-15",
        status: "At Risk",
        score: 72,
        lastUpdated: "1 hour ago",
        domains: [
            {
                id: 'd1',
                title: "Phase 1: External Portal",
                checks: [
                    {
                        id: 'c1',
                        title: "Supplier Portal User Training Completed",
                        status: 'Ready',
                        owner: "Training Lead"
                    },
                    {
                        id: 'c2',
                        title: "External Supplier Communication Plan Executed",
                        status: 'Ready',
                        owner: "Comms Manager"
                    },
                    {
                        id: 'c3',
                        title: "Portal Application Setup & Configuration",
                        status: 'Ready',
                        owner: "IT App Lead"
                    },
                    {
                        id: 'c4',
                        title: "Supplier Onboarding Documentation",
                        status: 'Ready',
                        owner: "Supplier Relations"
                    },
                    {
                        id: 'c5',
                        title: "Portal Security & Access Controls Validated",
                        status: 'Ready',
                        owner: "InfoSec Team"
                    }
                ]
            },
            {
                id: 'd2',
                title: "Phase 2: Performance Management",
                checks: [
                    {
                        id: 'c6',
                        title: "BAU Team Training on Performance Dashboards",
                        status: 'At Risk',
                        owner: "Ops Training Lead",
                        blockerReason: null
                    },
                    {
                        id: 'c7',
                        title: "KPI Framework Communication to Stakeholders",
                        status: 'Ready',
                        owner: "Comms Manager"
                    },
                    {
                        id: 'c8',
                        title: "Performance Management Module Setup",
                        status: 'Ready',
                        owner: "IT App Lead"
                    },
                    {
                        id: 'c9',
                        title: "Supplier Scorecard Templates Configured",
                        status: 'Ready',
                        owner: "Procurement Analyst"
                    },
                    {
                        id: 'c10',
                        title: "Performance Review Process Documentation",
                        status: 'At Risk',
                        owner: "Process Owner",
                        blockerReason: null
                    },
                    {
                        id: 'c11',
                        title: "Escalation Workflow for Underperformance",
                        status: 'Ready',
                        owner: "Supplier Relations"
                    },
                    {
                        id: 'c12',
                        title: "Integration with Contract Management System",
                        status: 'Ready',
                        owner: "Integration Lead"
                    }
                ]
            },
            {
                id: 'd3',
                title: "Phase 3: Segmentation",
                checks: [
                    {
                        id: 'c13',
                        title: "Segmentation Model User Training",
                        status: 'Not Ready',
                        owner: "Training Lead",
                        blockerReason: "Training materials still in draft, pending SME review"
                    },
                    {
                        id: 'c14',
                        title: "Supplier Segmentation Strategy Communication",
                        status: 'Not Ready',
                        owner: "Comms Manager",
                        blockerReason: "Executive approval pending for communication timeline"
                    },
                    {
                        id: 'c15',
                        title: "Segmentation Engine Application Setup",
                        status: 'Ready',
                        owner: "IT App Lead"
                    },
                    {
                        id: 'c16',
                        title: "Supplier Data Migration & Validation",
                        status: 'At Risk',
                        owner: "Data Lead",
                        blockerReason: null
                    },
                    {
                        id: 'c17',
                        title: "Segmentation Criteria & Rules Documentation",
                        status: 'Ready',
                        owner: "Process Owner"
                    },
                    {
                        id: 'c18',
                        title: "Automated Segmentation Workflow Testing",
                        status: 'Ready',
                        owner: "QA Lead"
                    }
                ]
            },
            {
                id: 'd4',
                title: "BAU Operations Readiness",
                checks: [
                    {
                        id: 'c19',
                        title: "BAU Support Team Training Completed",
                        status: 'Ready',
                        owner: "Ops Manager"
                    },
                    {
                        id: 'c20',
                        title: "Operational Runbooks & SOPs Published",
                        status: 'Ready',
                        owner: "Documentation Lead"
                    },
                    {
                        id: 'c21',
                        title: "Support Rota & On-Call Schedule Established",
                        status: 'Ready',
                        owner: "Ops Manager"
                    },
                    {
                        id: 'c22',
                        title: "Incident Management Process Defined",
                        status: 'Ready',
                        owner: "ITSM Lead"
                    },
                    {
                        id: 'c23',
                        title: "BAU Team Shadowing Sessions Completed",
                        status: 'At Risk',
                        owner: "Ops Training Lead",
                        blockerReason: null
                    }
                ]
            },
            {
                id: 'd5',
                title: "Backlog & Continuous Improvement",
                checks: [
                    {
                        id: 'c24',
                        title: "Post-Launch Backlog Prioritized",
                        status: 'Ready',
                        owner: "Product Owner"
                    },
                    {
                        id: 'c25',
                        title: "Known Issues & Workarounds Documented",
                        status: 'Ready',
                        owner: "Product Owner"
                    },
                    {
                        id: 'c26',
                        title: "Enhancement Request Process Established",
                        status: 'Ready',
                        owner: "Product Owner"
                    },
                    {
                        id: 'c27',
                        title: "Sprint Planning for Post-Launch Iterations",
                        status: 'Ready',
                        owner: "Scrum Master"
                    }
                ]
            },
            {
                id: 'd6',
                title: "Technology & Infrastructure",
                checks: [
                    {
                        id: 'c28',
                        title: "Production Environment Provisioned",
                        status: 'Ready',
                        owner: "DevOps Lead"
                    },
                    {
                        id: 'c29',
                        title: "Disaster Recovery Plan Tested",
                        status: 'Ready',
                        owner: "Infra Team"
                    },
                    {
                        id: 'c30',
                        title: "Monitoring & Alerting Configured",
                        status: 'Ready',
                        owner: "SRE Team"
                    },
                    {
                        id: 'c31',
                        title: "Performance Testing Completed",
                        status: 'Ready',
                        owner: "QA Lead"
                    },
                    {
                        id: 'c32',
                        title: "API Rate Limiting & Throttling Configured",
                        status: 'Ready',
                        owner: "Platform Team"
                    },
                    {
                        id: 'c33',
                        title: "Database Backup & Retention Policy Active",
                        status: 'Ready',
                        owner: "DBA Team"
                    }
                ]
            },
            {
                id: 'd7',
                title: "Compliance & Governance",
                checks: [
                    {
                        id: 'c34',
                        title: "GDPR Data Processing Impact Assessment",
                        status: 'Ready',
                        owner: "DPO"
                    },
                    {
                        id: 'c35',
                        title: "Supplier Contract Terms Alignment",
                        status: 'Ready',
                        owner: "Legal Team"
                    },
                    {
                        id: 'c36',
                        title: "Internal Audit Sign-off",
                        status: 'Ready',
                        owner: "Audit Lead"
                    },
                    {
                        id: 'c37',
                        title: "Change Advisory Board Approval",
                        status: 'Ready',
                        owner: "CAB Chair"
                    },
                    {
                        id: 'c38',
                        title: "Third-Party Risk Assessment Completed",
                        status: 'Ready',
                        owner: "Risk Manager"
                    }
                ]
            },
            {
                id: 'd8',
                title: "Communications & Change Management",
                checks: [
                    {
                        id: 'c39',
                        title: "Internal Stakeholder Communications Sent",
                        status: 'Ready',
                        owner: "Comms Manager"
                    },
                    {
                        id: 'c40',
                        title: "Executive Sponsor Briefing Completed",
                        status: 'Ready',
                        owner: "Program Lead"
                    },
                    {
                        id: 'c41',
                        title: "Change Impact Assessment Published",
                        status: 'Ready',
                        owner: "Change Manager"
                    },
                    {
                        id: 'c42',
                        title: "User Feedback Mechanism Established",
                        status: 'Ready',
                        owner: "Product Owner"
                    },
                    {
                        id: 'c43',
                        title: "Go-Live Announcement Prepared",
                        status: 'At Risk',
                        owner: "Comms Manager",
                        blockerReason: null
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Terminal 4 Crane Automation",
        description: "Rollout of automated straddle carriers for Container Berth 4.",
        lead: "Marco V.",
        owner: "Port Ops Director",
        targetDate: "2026-05-10",
        status: "Not Ready",
        score: 45,
        lastUpdated: "30 mins ago",
        domains: [
            {
                id: 'd1',
                title: "Health, Safety & Environment",
                checks: [
                    {
                        id: 'c1',
                        title: "Automated Zone Perimeter Testing",
                        status: 'Not Ready',
                        owner: "HSE Officer",
                        blockerReason: "Lidar fail-safe test failed on west gate"
                    },
                    { id: 'c2', title: "Emergency Stop Procedures Validated", status: 'Ready', owner: "Safety Lead" },
                    { id: 'c101', title: "ISO 45001 Certification Update", status: 'Ready', owner: "Compliance" }
                ]
            },
            {
                id: 'd2',
                title: "Workforce & Labour",
                checks: [
                    { id: 'c3', title: "Union Operator Sign-off", status: 'At Risk', owner: "HR Director" },
                    { id: 'c4', title: "Remote Control Desk Training", status: 'Ready', owner: "Ops Manager" },
                    {
                        id: 'c102',
                        title: "Maintenance Night Shift Certification",
                        status: 'Not Ready',
                        owner: "Eng Lead",
                        blockerReason: "High-voltage safety certs pending for night crew"
                    }
                ]
            },
            {
                id: 'd3',
                title: "Physical Infrastructure",
                checks: [
                    {
                        id: 'c5',
                        title: "Critical Spare Parts On-Site",
                        status: 'Not Ready',
                        owner: "Procurement",
                        blockerReason: "PLC modules stalled in customs"
                    },
                    { id: 'c103', title: "Wireless Mesh Coverage Audit", status: 'Ready', owner: "NetOps" }
                ]
            },
            {
                id: 'd4',
                title: "Systems Integration",
                checks: [
                    { id: 'c104', title: "TOS (Navis) Handshake Verified", status: 'Ready', owner: "IT App Lead" },
                    {
                        id: 'c105',
                        title: "Telemetry Latency < 50ms",
                        status: 'At Risk',
                        owner: "NetOps",
                        blockerReason: null
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Core Banking Ledger Upgrade",
        description: "Migration to T24 R22 for Retail Banking division.",
        lead: "Sarah Jenkins",
        owner: "Head of Payments",
        targetDate: "2026-06-01",
        status: "At Risk",
        score: 82,
        lastUpdated: "4 hours ago",
        domains: [
            {
                id: 'd1',
                title: "Regulatory & Compliance",
                checks: [
                    {
                        id: 'c1',
                        title: "FCA Reporting Module Validation",
                        status: 'At Risk',
                        owner: "Compliance Officer",
                        blockerReason: null
                    },
                    { id: 'c2', title: "GDPR Data Retention Check", status: 'Ready', owner: "DPO" },
                    { id: 'c201', title: "Internal Audit (3LoD) Sign-off", status: 'Ready', owner: "Audit Lead" }
                ]
            },
            {
                id: 'd2',
                title: "Security & Risk",
                checks: [
                    { id: 'c3', title: "Penetration Testing Sign-off", status: 'Ready', owner: "InfoSec" },
                    { id: 'c4', title: "Fraud Detection Rules Updated", status: 'Ready', owner: "Fraud Team" },
                    {
                        id: 'c202',
                        title: "Privileged Access (PAM) Review",
                        status: 'Not Ready',
                        owner: "IAM Team",
                        blockerReason: "Legacy admin accounts not pruned"
                    }
                ]
            },
            {
                id: 'd3',
                title: "Operational Reconciliation",
                checks: [
                    {
                        id: 'c5',
                        title: "EOD Batch Window Verified",
                        status: 'Not Ready',
                        owner: "Batch Ops",
                        blockerReason: "Performance variance in UAT is >5%"
                    },
                    { id: 'c203', title: "Nostro/Vostro Account Recs", status: 'Ready', owner: "Treasury Ops" }
                ]
            },
            {
                id: 'd4',
                title: "Data Migration",
                checks: [
                    { id: 'c204', title: "General Ledger Balance Match", status: 'Ready', owner: "Data Lead" },
                    { id: 'c205', title: "Transaction History Archive", status: 'Ready', owner: "Data Lead" }
                ]
            }
        ]
    },
    {
        id: 1,
        name: "SAP Migration 2.0",
        description: "Cloud migration of core ERP modules.",
        lead: "Alex Chen",
        owner: "Sarah Jones",
        targetDate: "2026-03-15",
        status: "At Risk",
        score: 68,
        lastUpdated: "2 hours ago",
        domains: [
            {
                id: 'd1',
                title: "People & Training",
                checks: [
                    { id: 'c1', title: "Operations Team Training Completed", status: 'Ready', owner: "L&D Team" },
                    {
                        id: 'c2',
                        title: "Support Rota Established",
                        status: 'Not Ready',
                        owner: "Sarah Jones",
                        blockerReason: "On-call coverage not confirmed for weekends"
                    }
                ]
            },
            {
                id: 'd2',
                title: "Technology & Infrastructure",
                checks: [
                    { id: 'c3', title: "Production Environment Hardening", status: 'Ready', owner: "DevOps" },
                    { id: 'c4', title: "Disaster Recovery Test Passed", status: 'At Risk', owner: "Infra Team" },
                    {
                        id: 'c5',
                        title: "Monitoring & Alerting Configured",
                        status: 'Not Ready',
                        owner: "SRE Team",
                        blockerReason: "Splunk ingestion pipeline failing"
                    }
                ]
            },
            {
                id: 'd3',
                title: "Process & Governance",
                checks: [
                    { id: 'c6', title: "Incident Management Process Defined", status: 'Ready', owner: "ITSM" },
                    { id: 'c7', title: "Change Management Approval", status: 'Ready', owner: "CAB" }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Customer Portal Redesign",
        description: "Frontend refresh for B2C portal.",
        lead: "Mike Ross",
        owner: "Ben Smith",
        targetDate: "2026-02-01",
        status: "Ready",
        score: 96,
        lastUpdated: "1 day ago",
        domains: [
            {
                id: 'd1',
                title: "People",
                checks: [{ id: 'c1', title: "Training", status: 'Ready', owner: "Ben" }]
            }
        ]
    },
    {
        id: 3,
        name: "Data Warehouse Legacy Decom",
        description: "Decommissioning of on-prem Oracle DBs.",
        lead: "Priya Patel",
        owner: "Ops Team A",
        targetDate: "2026-04-20",
        status: "Not Ready",
        score: 25,
        lastUpdated: "5 mins ago",
        domains: []
    }
];
