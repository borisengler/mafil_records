const express = require("express");
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 4000;

import fetch from 'node-fetch';
import { PostStudyCommentProps } from './model/StudyProps';
import { SeriesDataProps } from './model/SeriesProps';
import { getStudies, getStudy, postStudyComment } from "./routes/StudyRoutes";
import { getSeries, getSerie, postSeries } from "./routes/SeriesRoutes";
import { getPacsSeries, getPacsStudies } from "./routes/PACSRoutes";
import { getTemplatesForStudy, getDefaultTemplateForStudy, getTemplates} from './routes/TemplateRoutes';
import { validateSeriesForTemplate } from './routes/ValidationRoutes';
require('dotenv').config();

app.use(express.json());
app.use(cors());

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

const mafilApiUrl = process.env.MAFIL_API_URL;

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

app.get('/api/study', getStudies);
app.get('/api/study/:study_instance_uid', getStudy);
app.post('/api/study', postStudyComment);

app.get('/api/series', getSeries);
app.get('/api/series/:series_instance_uid', getSerie);
app.post('/api/series', postSeries);

app.get('/api/pacs/studies', getPacsStudies);
app.get('/api/pacs/series', getPacsSeries);


app.get('/api/study/:study_id/template', getTemplatesForStudy);
app.get('/api/template', getTemplates);
app.get('/api/study/:study_id/default_template', getDefaultTemplateForStudy);

app.post('/api/series/validate', validateSeriesForTemplate);

