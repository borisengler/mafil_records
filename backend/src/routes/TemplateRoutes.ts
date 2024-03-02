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
            comment: "",
            measurementTemplates: [
                {
                    name: "template1",
                    order_for_displaying: 1,
                    compulsory: true,
                    comment: null,
                    measurementTemplatePairs: [
                        {
                            key: "key1",
                            key_source: "ekg",
                            user_input: false,
                            type_of_comparison: "equal",
                            valueA: "500",
                            valueB: null,
                        },
                        {
                            key: "key2",
                            key_source: "measurements",
                            user_input: false,
                            type_of_comparison: "range",
                            valueA: "350",
                            valueB: null
                        }
                    ]
                },
                {
                    name: "template2",
                    order_for_displaying: 2,
                    compulsory: false,
                    comment: "Optional",
                }
            ]
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
        comment: "",
        measurementTemplates: [
            {
                name: "template1",
                order_for_displaying: 1,
                compulsory: true,
                comment: null,
                measurementTemplatePairs: [
                    {
                        key: "key1",
                        key_source: "ekg",
                        user_input: false,
                        type_of_comparison: "equal",
                        valueA: "500",
                        valueB: null,
                    },
                    {
                        key: "key2",
                        key_source: "measurements",
                        user_input: false,
                        type_of_comparison: "range",
                        valueA: "350",
                        valueB: null
                    }
                ]
            },
            {
                name: "template2",
                order_for_displaying: 2,
                compulsory: false,
                comment: "Optional",
            }
        ]
    };
    res.status(200).json(template);

}