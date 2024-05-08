import {PostStudyCommentProps} from '../model/StudyProps';

require('dotenv').config();

const {Pool} = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

export const getStudies = async (req, res) => {
  try {
    const {rows} = await pool.query('SELECT * FROM studiesdt');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

export const postStudyComment = async (req, res) => {
  const studyData: PostStudyCommentProps = req.body;

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
}

export const getStudy = async (req, res) => {
  const {study_instance_uid} = req.params;
  try {
    const {rows} = await pool.query('SELECT * FROM studiesdt WHERE study_instance_uid = $1', [study_instance_uid]);
    const studyData = rows.find(row => row.study_instance_uid === study_instance_uid);
    res.status(200).json(studyData ?? null);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}