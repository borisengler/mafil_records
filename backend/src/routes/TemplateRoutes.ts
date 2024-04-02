import { Template, FormattedTemplate, VersionedTemplate, MeasurementTemplate, MeasurementTemplatePair } from "../../../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getTemplatesForStudy = async (req, res) => {


    const { study_id } = req.params;

    // TODO get from api and FILTER based on project id
    // .filter(template => template.project === projectId)
    
    const templates: Template[] = [
        T1,
        T2
    ];


    const versionedTemplates: FormattedTemplate[] = templates.flatMap((template) => {
        return Array.isArray(template.versioned_templates) 
          ? template.versioned_templates.map((vTemplate) => ({
              id: getFormattedTemplateId(template.id, vTemplate.version),
              name: `${template.name} (${vTemplate.version})`,
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
}

export const getDefaultTemplateForStudy = async (req, res) => {
    const { study_id } = req.params;

    const templates: Template[] = [
        T1,
        T2
    ];

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
        name: `${defaultTemplate.name} (${latestVersionedTemplate.version})`,
        is_default: defaultTemplate.is_default,
        order_for_displaying: defaultTemplate.order_for_displaying,
        comment: latestVersionedTemplate.comment,
        measurementTemplates: latestVersionedTemplate.measurement_templates,
    }
    res.status(200).json(formattedTemplate);

}

const getFormattedTemplateId = (templateId: number, templateVersion: number) : string => {
    return `${templateId} - ${templateVersion}`;
};

const MTP1: MeasurementTemplatePair= {
    key: "general_eeg",
    key_source: "general_eeg",
    user_input: true,
    type_of_comparison: "equal",
    valueA: "true",
    valueB: null,
};

const MTP2: MeasurementTemplatePair = {
    key: "key2",
    key_source: "measurements",
    user_input: false,
    type_of_comparison: "range",
    valueA: "1",
    valueB: "10"
};

const MTP3: MeasurementTemplatePair = {
    key: "general_eeg",
    key_source: "",
    user_input: true,
    type_of_comparison: "equal",
    valueA: "true",
    valueB: null
};

const MTP4: MeasurementTemplatePair = {
    key: "general_et",
    key_source: "",
    user_input: true,
    type_of_comparison: "equal",
    valueA: "false",
    valueB: null
};


const MTP5: MeasurementTemplatePair = {
    key: "stim_protocol",
    key_source: "",
    user_input: true,
    type_of_comparison: "equal",
    valueA: "Stim protocol name",
    valueB: null
};

const MT1: MeasurementTemplate= {
    name: "localizer",
    order_for_displaying: 1,
    compulsory: true,
    comment: null,
    measurement_template_pairs: [
        MTP1,
        MTP2
    ]
}

const MT2: MeasurementTemplate = {
    name: "t1_mprage_sag",
    order_for_displaying: 2,
    compulsory: false,
    comment: "Optional",
}

const MT4: MeasurementTemplate = {
    name: "tra",
    order_for_displaying: 3,
    compulsory: false,
    comment: "Optional",
    measurement_template_pairs: [
        MTP3,
        MTP4,
        MTP5
    ]
}

const MT3: MeasurementTemplate = {
    name: "t2_spc_FLAIR_sag_p2",
    order_for_displaying: 3,
    compulsory: false,
    comment: "Optional",
}

const VT1: VersionedTemplate = {
    version: 2,
    comment: "",
    measurement_templates: [
        MT1,
        MT2,
        MT3,
        MT4
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

const VT2: VersionedTemplate = {
    version: 1,
    comment: "",
    measurement_templates: []
}

const T2: Template = {
    id: 2,
    name: "Template2",
    is_default: false,
    order_for_displaying: 2,
    measurement_modality: "MR",
    versioned_templates: [VT2]
}
