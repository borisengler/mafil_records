const axios = require('axios');
const express = require("express");

require('dotenv').config();
const pacsApiUrl = process.env.PACS_API_URL;

const headers = {
    'Authorization': `Token c07d70fd9f56bc470a83c28bcd0a4718ff198570`,
}

export const getPacsStudies = async (req, res) => {
    const { start, end } = req.query;
    const url = `${pacsApiUrl}/json?start=${start}&end=${end}&level=STUDY`;
  
    try {
      const response = await axios.get(
        url,
        {
          headers: headers,
        }
      );
      const json: any = await response.data;
      res.status(200).json(json);
    } catch (err) {
      console.error("error");
      res.status(500).send();
    }
  }

export const getPacsSeries = async (req, res) => {
    const { accession_number } = req.query;
    const url = `${pacsApiUrl}/json?accession_number=${accession_number}&level=SERIES`;

    try {
      const response = await axios.get(
        url,
        {
          headers: headers,
        }
      );
  
      const json = await response.data;
      res.status(200).json(json[0].series);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }