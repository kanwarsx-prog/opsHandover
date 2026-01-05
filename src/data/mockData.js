export const mockHandovers = [
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
