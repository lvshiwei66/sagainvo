import { InvoiceTemplate } from './types';

const TEMPLATE_STORAGE_KEY = 'sagainvo:templates';

export function loadTemplates(): InvoiceTemplate[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((template: any) => ({
      ...template,
      template: {
        ...template.template,
        // Ensure all required date fields are properly formatted
        date: template.template.date || new Date().toISOString().split("T")[0],
        dueDate: template.template.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: template.template.createdAt || new Date().toISOString(),
        updatedAt: template.template.updatedAt || new Date().toISOString(),
      }
    })) as InvoiceTemplate[];
  } catch (error) {
    console.error('Failed to load templates:', error);
    return [];
  }
}

export function saveTemplates(templates: InvoiceTemplate[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save templates:', error);
  }
}

export function getDefaultTemplates(): InvoiceTemplate[] {
  // These will be the built-in templates that users can choose from
  return loadTemplates().filter(template => template.isDefault);
}

export function getUserTemplates(): InvoiceTemplate[] {
  // These will be templates created by the user
  return loadTemplates().filter(template => !template.isDefault);
}

export function addTemplate(template: InvoiceTemplate): void {
  const templates = loadTemplates();
  const newTemplate = {
    ...template,
    id: template.id || `tmpl_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  templates.push(newTemplate);
  saveTemplates(templates);
}

export function removeTemplate(templateId: string): void {
  const templates = loadTemplates();
  const filtered = templates.filter(template => template.id !== templateId);
  saveTemplates(filtered);
}