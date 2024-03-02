import { Template } from "../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getTemplatesForStudy = async (req, res) => {

    const { study_id } = req.params;

    const templates: Template[] = [
        {
            name: "Template1",
            order_for_displaying: 1,
            measurement_modality: "MR",
            comment: ""
        },
        {
            name: "Template2",
            order_for_displaying: 2,
            measurement_modality: "MR",
            comment: "This one has comment"
        }
    ];

    res.status(200).json(templates);
}

export const getTemplate = async (req, res) => {
    const { study_id } = req.params;
    const template: Template = {
        name: "Template1",
        order_for_displaying: 1,
        measurement_modality: "MR",
        comment: ""
    };
    res.status(200).json(template);

}