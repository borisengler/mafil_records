import { Template, FormattedTemplate, VersionedTemplate, MeasurementTemplate, MeasurementTemplatePair } from "../../../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getTemplatesForStudy = async (req, res) => {
    const { study_id } = req.params;    const token = req.headers['token'];

    try {
        const headers = {
            'Cookie': 'sessionid=b1636ckl9oeerzk92rb4y5ktkrtinv4h'
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
                }))
              : [];
          });
    
          versionedTemplates.sort((a, b) => {
            const orderComparison = a.order_for_displaying - b.order_for_displaying;
            return orderComparison === 0 ? a.version - b.version : orderComparison;
          });
          
        res.status(200).json(versionedTemplates);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

export const getTemplates = async (req, res) => {
    const token = req.headers['token'];

    try {
        const headers = {
            'Cookie': 'sessionid=b1636ckl9oeerzk92rb4y5ktkrtinv4h'
          };
        const response = await axios.get(mafilApiUrl + 'templates', { headers });
        const templates = response.data.results;
        console.log(templates);

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
                }))
              : [];
          });
    
          versionedTemplates.sort((a, b) => {
            const orderComparison = a.order_for_displaying - b.order_for_displaying;
          
            return orderComparison === 0 ? a.version - b.version : orderComparison;
          });
          
        res.status(200).json(versionedTemplates);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

export const getDefaultTemplateForStudy = async (req, res) => {
    const { study_id } = req.params;
    const token = req.headers['token'];

    try {
        const headers = {
            'Cookie': 'sessionid=b1636ckl9oeerzk92rb4y5ktkrtinv4h'
          };
        const response = await axios.get(mafilApiUrl + 'templates', { headers });
        const templates = response.data.results;
        
    const defaultTemplate: Template = templates.find((template) => template.is_default);
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
    }
    res.status(200).json(formattedTemplate);
    } catch (err) {
        res.status(500).send();
    }
}

const getFormattedTemplateId = (templateId: number, templateVersion: number) : string => {
    return `${templateId} - ${templateVersion}`;
};
