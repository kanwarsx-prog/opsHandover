export const mockHandovers = [
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
    },
];
