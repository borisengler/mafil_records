CREATE TABLE IF NOT EXISTS seriesdt (
  series_instance_uid VARCHAR(255) PRIMARY KEY,
  seq_state VARCHAR(255) DEFAULT 'pending',
  measured TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  measurement_notes TEXT,
  stim_protocol VARCHAR(255),
  stim_log_file VARCHAR(255),
  fyzio_raw_file VARCHAR(255),
  general_eeg BOOLEAN DEFAULT false,
  general_et BOOLEAN DEFAULT false,
  bp_ekg BOOLEAN DEFAULT false,
  bp_resp BOOLEAN DEFAULT false,
  bp_gsr BOOLEAN DEFAULT false,
  bp_acc BOOLEAN DEFAULT false,
  siemens_ekg BOOLEAN DEFAULT false,
  siemens_resp BOOLEAN DEFAULT false,
  siemens_pt BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS studiesdt (
  study_instance_uid VARCHAR(255) PRIMARY KEY,
  general_comment TEXT
);
