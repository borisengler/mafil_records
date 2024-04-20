import { Project } from "../../../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getProjects = async (req, res) => {

    const token = req.headers['token'];

    try {
        const headers = {
            'Cookie': 'sessionid=b1636ckl9oeerzk92rb4y5ktkrtinv4h'
          };
        const response = await axios.get(mafilApiUrl + 'projects', { headers });
        const projects = response.data;
        res.status(200).json(projects.results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects" });
    }
}