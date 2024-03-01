const express = require("express");
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

import fetch from 'node-fetch';

app.use(express.json());
app.use(cors());

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

// Accept unauthorized to get around misconfigured testing PACS-API
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send(`Backend server is running on port ${port}`);
});

app.get("/api", (req, res) => {
  res.send(`Backend API accessible`);
});

app.get('/api/study', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM studiesdt');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.post('/api/study', async (req, res) => {
  const studyData = req.body;

  try {
    await pool.query(
      `INSERT INTO studiesdt (study_instance_uid, general_comment)
        VALUES ($1, $2)
        ON CONFLICT (study_instance_uid)
        DO UPDATE SET
          general_comment = $2`,
      [
        studyData.study_instance_uid,
        studyData.general_comment,
      ]
    );
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.get('/api/study/:study_instance_uid', async (req, res) => {
  const { study_instance_uid } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM studiesdt WHERE study_instance_uid = $1', [study_instance_uid]);
    const studyData = rows.find(row => row.study_instance_uid === study_instance_uid);
    res.status(200).json(studyData ?? null);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.get('/api/series', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM seriesdt');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.post('/api/series', async (req, res) => {
  const seriesDataArray = req.body;

  try {
    await Promise.all(
      seriesDataArray.map(async (seriesData) => {
        await pool.query(
          `INSERT INTO seriesdt (series_instance_uid, seq_state, measured, last_updated, measurement_notes,
            stim_protocol, stim_log_file, fyzio_raw_file, general_eeg, general_et, bp_ekg, bp_resp, bp_gsr, bp_acc,
            siemens_ekg, siemens_resp, siemens_gsr, siemens_acc)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (series_instance_uid)
          DO UPDATE SET
            seq_state = $2,
            measured = $3,
            last_updated = $4,
            measurement_notes = $5,
            stim_protocol = $6,
            stim_log_file = $7,
            fyzio_raw_file = $8,
            general_eeg = $9,
            general_et = $10,
            bp_ekg = $11,
            bp_resp = $12,
            bp_gsr = $13,
            bp_acc = $14,
            siemens_ekg = $15,
            siemens_resp = $16,
            siemens_gsr = $17,
            siemens_acc = $18`,
          [
            seriesData.series_instance_uid,
            seriesData.seq_state,
            seriesData.measured,
            seriesData.last_updated,
            seriesData.measurement_notes,
            seriesData.stim_protocol,
            seriesData.stim_log_file,
            seriesData.fyzio_raw_file,
            seriesData.general_eeg,
            seriesData.general_et,
            seriesData.bp_ekg,
            seriesData.bp_resp,
            seriesData.bp_gsr,
            seriesData.bp_acc,
            seriesData.siemens_ekg,
            seriesData.siemens_resp,
            seriesData.siemens_gsr,
            seriesData.siemens_acc,
          ]
        );
      })
    );
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.get('/api/series/:series_instance_uid', async (req, res) => {
  const { series_instance_uid } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM seriesdt WHERE series_instance_uid = $1', [series_instance_uid]);
    const seriesData = rows.find(row => row.series_instance_uid === series_instance_uid);
    res.status(200).json(seriesData ?? null);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.get('/api/pacs/studies', async (req, res) => {
  const { start, end } = req.query;
  const url = `https://pacs-api.devel.mafildb.ics.muni.cz/json?start=${start}&end=${end}&level=STUDY`;
  console.log('get: ', url);

  try {
    const resp = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token c07d70fd9f56bc470a83c28bcd0a4718ff198570`,
        },
      });
    const json: any = await resp.json();
    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.get('/api/pacs/series', async (req, res) => {
  const { accession_number } = req.query;
  const url = `https://pacs-api.devel.mafildb.ics.muni.cz/json?accession_number=${accession_number}&level=SERIES`;
  console.log('get: ', url);
  try {
    const resp = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token c07d70fd9f56bc470a83c28bcd0a4718ff198570`,
        },
      });
    const json = await resp.json();
    res.status(200).json(json[0].series);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
