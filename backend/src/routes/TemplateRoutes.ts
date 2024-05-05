import { version } from "os";
import { Template, FormattedTemplate, VersionedTemplate, MeasurementTemplate, MeasurementTemplatePair } from "../../../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getTemplatesForStudy = async (req, res) => {
    const { project_id } = req.params;
    const token = req.headers['token'];

    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
        const response = await axios.get(mafilApiUrl + 'templates', { headers });
        const templates = response.data.results;

        const versionedTemplates: FormattedTemplate[] = templates.flatMap((template) => {
            return Array.isArray(template.versioned_templates) 
              ? template.versioned_templates.map((vTemplate) => ({
                  id: getFormattedTemplateId(template.id, vTemplate.version),
                  name: template.name,
                  version: vTemplate.version,
                  is_default: template.is_default,
                  order_for_displaying: template.order_for_displaying || 0,
                  comment: vTemplate.comment || null,
                  measurementTemplates: vTemplate.measurement_templates || [],
                  project_uuid: template.project.uuid,
                  project_name: template.project.acronym
                }))
              : [];
          });
          const projectTemplates = versionedTemplates.filter((template) => template.project_uuid == project_id);
          projectTemplates.sort((a, b) => {
            const orderComparison = a.order_for_displaying - b.order_for_displaying;
            return orderComparison === 0 ? a.version - b.version : orderComparison;
          });

          
        res.status(200).json(projectTemplates);
    } catch (err) {
        res.status(500).send();
    }
}

export const getTemplates = async (req, res) => {
    const token = req.headers['token'];

    try {
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(mafilApiUrl + 'templates', { headers });
        const templates = response.data.results;

        const versionedTemplates: FormattedTemplate[] = templates.flatMap((template) => {
            return Array.isArray(template.versioned_templates) 
              ? template.versioned_templates.map((vTemplate) => ({
                  id: getFormattedTemplateId(template.id, vTemplate.version),
                  name: template.name,
                  version: vTemplate.version,
                  is_default: template.is_default,
                  order_for_displaying: template.order_for_displaying || 0,
                  comment: vTemplate.comment || null,
                  measurementTemplates: vTemplate.measurement_templates || [],
                  project_uuid: template.project.uuid,
                  project_name: template.project.acronym
                }))
              : [];
          });
    
          versionedTemplates.sort((a, b) => {
            const orderComparison = a.order_for_displaying - b.order_for_displaying;
          
            return orderComparison === 0 ? a.version - b.version : orderComparison;
          });

        res.status(200).json(versionedTemplates);
    } catch (err) {
        res.status(500).send();
    }
}

export const getDefaultTemplateForStudy = async (req, res) => {
    const { project_id } = req.params;
    const token = req.headers['token'];

    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      const response = await axios.get(mafilApiUrl + 'templates', { headers });
      const templates = response.data.results;
        
      const defaultTemplate: Template = templates.filter((template) => template.project.uuid = project_id).find((template) => template.is_default);
    if (defaultTemplate == null) {
      res.status(204).send();
      return;
    }

    const versionedTemplates: VersionedTemplate[] = defaultTemplate?.versioned_templates || [];
    const sortedVersionedTemplates = versionedTemplates.sort((a, b) => b.version - a.version);
    const latestVersionedTemplate: VersionedTemplate | null = sortedVersionedTemplates[0] || null;

    const formattedTemplate: FormattedTemplate = {
        id: getFormattedTemplateId(defaultTemplate.id, latestVersionedTemplate.version),
        version: latestVersionedTemplate.version,
        name: defaultTemplate.name,
        is_default: defaultTemplate.is_default,
        order_for_displaying: defaultTemplate.order_for_displaying,
        comment: latestVersionedTemplate.comment,
        measurementTemplates: latestVersionedTemplate.measurement_templates,
        project_uuid: defaultTemplate.project.uuid,
        project_name: defaultTemplate.project.acronym
    }
    res.status(200).json(formattedTemplate);
    } catch (err) {
        res.status(500).send();
    }
}

const getFormattedTemplateId = (templateId: number, templateVersion: number) : string => {
    return `${templateId} - ${templateVersion}`;
};

const getIdFromFormattedId = (formattedId: string) : number => {
  const parts = formattedId.split(' - ');
    const templateId = parseInt(parts[0], 10);
    return templateId;
};


export const postTemplate = async (req, res) => {
  const token = req.headers['token'];

    try {
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const body = req.body;

        const response = await axios.post(mafilApiUrl + 'templates', body, { headers });
        res.status(200).json();
    } catch (err) {
      res.status(500).send();
    }
}

export const patchTemplate = async (req, res) => {
  const token = req.headers['token'];
  const { template_id } = req.params;

    try {
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const body = req.body;

        const response = await axios.patch(mafilApiUrl + `templates/${getIdFromFormattedId(template_id)}`, body, { headers });
        res.status(200).json();
    } catch (err) {
      res.status(500).send();
    }
}

export const deleteTemplate = async (req, res) => {
  const token = req.headers['token'];
  const { template_id, version } = req.params;
  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'version': version
    };

    const response = await axios.delete(mafilApiUrl + `templates/${getIdFromFormattedId(template_id)}`, { headers });
    res.status(200).json();
  } catch (err) {
    res.status(500).send();
  }
}