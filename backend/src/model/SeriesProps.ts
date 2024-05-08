export interface SeriesDataProps {
  series_instance_uid: string;
  seq_state: string;
  measured?: Date;
  last_updated?: Date;
  comment?: string;
  stim_protocol?: string;
  stim_log_file?: string;
  fyzio_raw_file?: string;
  general_eeg?: boolean;
  general_et?: boolean;
  bp_ekg?: boolean;
  bp_resp?: boolean;
  bp_gsr?: boolean;
  bp_acc?: boolean;
  siemens_ekg?: boolean;
  siemens_resp?: boolean;
  siemens_pt?: boolean;
}