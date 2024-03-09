import { Template, FormattedTemplate, VersionedTemplate } from "../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getTemplatesForStudy = async (req, res) => {

    const { study_id } = req.params;
    
    const templates: Template[] = [
        T1,
        T2
    ];

    const versionedTemplates: FormattedTemplate[] = templates.flatMap((template) => {
        return Array.isArray(template.versioned_templates) 
          ? template.versioned_templates.map((vTemplate) => ({
              id: `${template.id}-(${vTemplate.version})`,
              name: `${template.name} (${vTemplate.version})`,
              version: vTemplate.version,
              is_default: template.is_default,
              order_for_displaying: template.order_for_displaying || 0,
              comment: vTemplate.comment || null,
              measurementTemplates: vTemplate.measurementTemplates || [],
            }))
          : [];
      });

      versionedTemplates.sort((a, b) => {
        const orderComparison = a.order_for_displaying - b.order_for_displaying;
      
        return orderComparison === 0 ? a.version - b.version : orderComparison;
      });
      
      console.log(versionedTemplates);

    res.status(200).json(versionedTemplates);
}

export const getDefaultTemplateForStudy = async (req, res) => {
    const { study_id } = req.params;

    const templates: Template[] = [
        T1,
        T2
    ];

    const defaultTemplate: Template = templates.find((template) => template.is_default);

    const versionedTemplates: VersionedTemplate[] = defaultTemplate?.versioned_templates || [];
    const sortedVersionedTemplates = versionedTemplates.sort((a, b) => b.version - a.version);
    const latestVersionedTemplate: VersionedTemplate | null = sortedVersionedTemplates[0] || null;

    const formattedTemplate: FormattedTemplate = {
        name: `${defaultTemplate.name} (${latestVersionedTemplate.version})`,
        is_default: defaultTemplate.is_default,
        order_for_displaying: defaultTemplate.order_for_displaying,
        comment: latestVersionedTemplate.comment,
        measurementTemplates: latestVersionedTemplate.measurementTemplates,
    }
    res.status(200).json(formattedTemplate);

}

const MTP1 = {
    key: "key1",
    key_source: "ekg",
    user_input: false,
    type_of_comparison: "equal",
    valueA: "500",
    valueB: null,
};

const MTP2 = {
    key: "key2",
    key_source: "measurements",
    user_input: false,
    type_of_comparison: "range",
    valueA: "350",
    valueB: null
};

const MT1 = {
    name: "localizer",
    order_for_displaying: 1,
    compulsory: true,
    comment: null,
    measurementTemplatePairs: [
        MTP1,
        MTP2
    ]
}

const MT2 = {
    name: "t1_mprage_sag_p2_1iso",
    order_for_displaying: 2,
    compulsory: false,
    comment: "Optional",
}

const MT3 = {
    name: "t2_spc_FLAIR_sag_p2_isoX",
    order_for_displaying: 3,
    compulsory: false,
    comment: "Optional",
}

const VT1: VersionedTemplate = {
    version: 2,
    comment: "",
    measurementTemplates: [
        MT1,
        MT2
    ]
}

const T1: Template = {
    id: 1,
    name: "Template1",
    is_default: true,
    order_for_displaying: 1,
    measurement_modality: "MR",
    versioned_templates: [VT1]
}

const VT2 = {
    version: 1,
    comment: "",
    measurementTemplates: []
}

const T2 = {
    id: 2,
    name: "Template2",
    is_default: false,
    order_for_displaying: 2,
    measurement_modality: "MR",
    versioned_templates: [VT2]
}
