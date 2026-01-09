import { supabase } from '../lib/supabaseClient';

/**
 * Template Service
 * Handles all template library operations
 */

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all templates with optional filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Filter by category (system, organization, user)
 * @param {boolean} filters.isPublic - Filter by public status
 * @param {string} filters.search - Search in name/description
 * @returns {Promise<Array>} Array of templates
 */
export async function fetchTemplates(filters = {}) {
    try {
        let query = supabase
            .from('template_libraries')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.category) {
            query = query.eq('category', filters.category);
        }

        if (filters.isPublic !== undefined) {
            query = query.eq('is_public', filters.isPublic);
        }

        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
}

/**
 * Fetch a single template by ID with all domains and checks
 * @param {number} templateId - Template ID
 * @returns {Promise<Object>} Template with nested domains and checks
 */
export async function fetchTemplateById(templateId) {
    try {
        // Fetch template
        const { data: template, error: templateError } = await supabase
            .from('template_libraries')
            .select('*')
            .eq('id', templateId)
            .single();

        if (templateError) throw templateError;

        // Fetch domains for this template
        const { data: domains, error: domainsError } = await supabase
            .from('template_domains')
            .select('*')
            .eq('template_id', templateId)
            .order('order_index', { ascending: true });

        if (domainsError) throw domainsError;

        // Fetch checks for each domain
        const domainsWithChecks = await Promise.all(
            domains.map(async (domain) => {
                const { data: checks, error: checksError } = await supabase
                    .from('template_checks')
                    .select('*')
                    .eq('domain_id', domain.id)
                    .order('order_index', { ascending: true });

                if (checksError) throw checksError;

                return {
                    ...domain,
                    checks: checks || []
                };
            })
        );

        return {
            ...template,
            domains: domainsWithChecks
        };
    } catch (error) {
        console.error('Error fetching template by ID:', error);
        throw error;
    }
}

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new template
 * @param {Object} templateData - Template data
 * @param {string} templateData.name - Template name
 * @param {string} templateData.description - Template description
 * @param {string} templateData.category - Category (system, organization, user)
 * @param {boolean} templateData.isPublic - Public visibility
 * @param {Array} templateData.domains - Array of domains with checks
 * @returns {Promise<Object>} Created template
 */
export async function createTemplate(templateData) {
    try {
        // Create template
        const { data: template, error: templateError } = await supabase
            .from('template_libraries')
            .insert({
                name: templateData.name,
                description: templateData.description,
                category: templateData.category || 'user',
                is_public: templateData.isPublic || false,
                created_by: templateData.createdBy || 'current_user'
            })
            .select()
            .single();

        if (templateError) throw templateError;

        // Create domains and checks
        if (templateData.domains && templateData.domains.length > 0) {
            for (let i = 0; i < templateData.domains.length; i++) {
                const domainData = templateData.domains[i];

                const { data: domain, error: domainError } = await supabase
                    .from('template_domains')
                    .insert({
                        template_id: template.id,
                        title: domainData.title,
                        description: domainData.description,
                        order_index: i
                    })
                    .select()
                    .single();

                if (domainError) throw domainError;

                // Create checks for this domain
                if (domainData.checks && domainData.checks.length > 0) {
                    const checksToInsert = domainData.checks.map((check, j) => ({
                        domain_id: domain.id,
                        title: check.title,
                        owner_placeholder: check.ownerPlaceholder || check.owner,
                        requires_approval: check.requiresApproval || false,
                        order_index: j
                    }));

                    const { error: checksError } = await supabase
                        .from('template_checks')
                        .insert(checksToInsert);

                    if (checksError) throw checksError;
                }
            }
        }

        return await fetchTemplateById(template.id);
    } catch (error) {
        console.error('Error creating template:', error);
        throw error;
    }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a template
 * @param {number} templateId - Template ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated template
 */
export async function updateTemplate(templateId, updates) {
    try {
        const { data, error } = await supabase
            .from('template_libraries')
            .update(updates)
            .eq('id', templateId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating template:', error);
        throw error;
    }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a template (cascades to domains and checks)
 * @param {number} templateId - Template ID
 * @returns {Promise<void>}
 */
export async function deleteTemplate(templateId) {
    try {
        const { error } = await supabase
            .from('template_libraries')
            .delete()
            .eq('id', templateId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
    }
}

// ============================================================================
// CLONE OPERATIONS
// ============================================================================

/**
 * Clone an existing template
 * @param {number} templateId - Template ID to clone
 * @param {string} newName - Name for the cloned template
 * @returns {Promise<Object>} Cloned template
 */
export async function cloneTemplate(templateId, newName) {
    try {
        // Fetch original template
        const original = await fetchTemplateById(templateId);

        // Create new template with same structure
        const clonedTemplate = await createTemplate({
            name: newName || `${original.name} (Copy)`,
            description: original.description,
            category: 'user', // Clones are always user templates
            isPublic: false,
            domains: original.domains.map(domain => ({
                title: domain.title,
                description: domain.description,
                checks: domain.checks.map(check => ({
                    title: check.title,
                    ownerPlaceholder: check.owner_placeholder,
                    requiresApproval: check.requires_approval
                }))
            }))
        });

        return clonedTemplate;
    } catch (error) {
        console.error('Error cloning template:', error);
        throw error;
    }
}

// ============================================================================
// IMPORT/EXPORT OPERATIONS
// ============================================================================

/**
 * Export a template to JSON
 * @param {number} templateId - Template ID
 * @returns {Promise<Object>} Template JSON
 */
export async function exportTemplate(templateId) {
    try {
        const template = await fetchTemplateById(templateId);

        // Remove database-specific fields
        const exportData = {
            name: template.name,
            description: template.description,
            category: template.category,
            domains: template.domains.map(domain => ({
                title: domain.title,
                description: domain.description,
                checks: domain.checks.map(check => ({
                    title: check.title,
                    ownerPlaceholder: check.owner_placeholder,
                    requiresApproval: check.requires_approval
                }))
            }))
        };

        return exportData;
    } catch (error) {
        console.error('Error exporting template:', error);
        throw error;
    }
}

/**
 * Import a template from JSON
 * @param {Object} jsonData - Template JSON data
 * @returns {Promise<Object>} Imported template
 */
export async function importTemplate(jsonData) {
    try {
        return await createTemplate({
            ...jsonData,
            category: 'user', // Imported templates are user templates
            isPublic: false
        });
    } catch (error) {
        console.error('Error importing template:', error);
        throw error;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get template usage statistics
 * @param {number} templateId - Template ID
 * @returns {Promise<Object>} Usage stats
 */
export async function getTemplateStats(templateId) {
    try {
        // Count how many handovers were created from this template
        // This would require tracking template_id in handovers table
        // For now, return basic stats
        const template = await fetchTemplateById(templateId);

        const totalDomains = template.domains.length;
        const totalChecks = template.domains.reduce((sum, domain) => sum + domain.checks.length, 0);
        const checksRequiringApproval = template.domains.reduce(
            (sum, domain) => sum + domain.checks.filter(c => c.requires_approval).length,
            0
        );

        return {
            totalDomains,
            totalChecks,
            checksRequiringApproval,
            usageCount: 0 // TODO: Implement usage tracking
        };
    } catch (error) {
        console.error('Error getting template stats:', error);
        throw error;
    }
}
