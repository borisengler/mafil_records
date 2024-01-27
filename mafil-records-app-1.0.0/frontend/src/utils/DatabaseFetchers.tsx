export async function getStudyData(study_instance_uid: string) {
  // First, try to get the data from localStorage
  let studyData = localStorage.getItem(`study-${study_instance_uid}`);
  if (studyData) {
    return JSON.parse(studyData);
  }

  // If not in localStorage, try to get the data from the backend server
  const response = await fetch(
    `/api/study/${study_instance_uid}`,
    {
      method: 'GET',
      mode: 'cors',
    });
  if (response.ok) {
    studyData = await response.json();
    if (studyData !== null) {
      return studyData;
    }
  }

  // If the data is not available in both localStorage and backend server, use default values
  return {
    study_instance_uid: study_instance_uid,
    general_comment: '',
  };
}

export async function getSeriesData(seriesInstanceUID: string) {
  // First, try to get the data from localStorage
  let seriesData = localStorage.getItem(`series-${seriesInstanceUID}`);
  if (seriesData) {
    return JSON.parse(seriesData);
  }

  // If not in localStorage, try to get the data from the backend server
  const response = await fetch(
    `/api/series/${seriesInstanceUID}`,
    {
      method: 'GET',
      mode: 'cors',
    });
  if (response.ok) {
    seriesData = await response.json();
    if (seriesData !== null) {
      return seriesData;
    }
  }

  // If the data is not available in both localStorage and backend server, use default values
  return {
    series_instance_uid: seriesInstanceUID,
    seq_state: 'pending',
    is_selected: false,
    is_expanded: false,
    measured: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    measurement_notes: '',
    stim_protocol: '',
    stim_log_file: '',
    fyzio_raw_file: '',
    general_eeg: false,
    general_et: false,
    bp_ekg: false,
    bp_resp: false,
    bp_gsr: false,
    bp_acc: false,
    siemens_ekg: false,
    siemens_resp: false,
    siemens_gsr: false,
    siemens_acc: false,
  };
}

