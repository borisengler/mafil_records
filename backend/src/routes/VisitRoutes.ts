const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getVisit = async (req, res) => {
    const { visit_name } = req.params;
    const token = req.headers['token'];

    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
        const response = await axios.get(mafilApiUrl + 'visits', { headers });
        const visits = response.data;
        res.status(200).json(visits.results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching visits" });
    }
}