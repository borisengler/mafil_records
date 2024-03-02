const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

export const getSeries = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM seriesdt');
      res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

export const getSerie = async (req, res) => {
    const { series_instance_uid } = req.params;
    try {
      const { rows } = await pool.query('SELECT * FROM seriesdt WHERE series_instance_uid = $1', [series_instance_uid]);
      const seriesData = rows.find(row => row.series_instance_uid === series_instance_uid);
      res.status(200).json(seriesData ?? null);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }

export const postSeries = async (req, res) => {
    const seriesDataArray: SeriesDataProps[] = req.body;
  
  
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
  }