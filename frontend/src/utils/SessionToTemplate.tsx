import {
    FormattedMeasurement,
    FormattedSession,
    FormattedTemplate,
    MeasurementTemplate,
    MeasurementTemplatePair
  } from '../../../shared/Types';
  
  
  export function getTemplateFromSession(session: FormattedSession): FormattedTemplate {
  
    return {
      id: '',
      name: '',
      version: 1,
      is_default: false,
      order_for_displaying: null,
      comment: '',
      measurementTemplates: session.measurements.map((m) => getMeasurementTemplateFromMeasurement(m)),
      project_uuid: '',
      project_name: ''
    };
  }
  
  function getMeasurementTemplateFromMeasurement(measurement: FormattedMeasurement): MeasurementTemplate {
    return {
      name: measurement.series_description ? measurement.series_description : '',
      order_for_displaying: measurement.order_of_measurement,
      compulsory: true,
      comment: '',
      measurement_template_pairs: getMeasurementTemplatePairsFromMeasurement(measurement)
    }
  }
  
  function getMeasurementTemplatePairsFromMeasurement(measurement: FormattedMeasurement): MeasurementTemplatePair[] {
    type StringKey = {
      key: string;
      value: 'stimulation_protocol' | 'log_file_name' | 'raw_file_name'
    };
    type BoolKey = {
      key: string;
      value: 'fyzio_EKG' | 'fyzio_respiration_belt' | 'fyzio_GSR' | 'fyzio_ACC' | 'fyzio_pulse_oxymeter' | 'fyzio_external' |
        'siemens_EKG' | 'siemens_respiration' | 'siemens_PT'
    };
  
  
    const stringKeys: StringKey[] = [
      {key: 'stim_protocol', value: 'stimulation_protocol'},
      {key: 'stim_log_file', value: 'stimulation_protocol'},
      {key: 'fyzio_raw_file', value: 'raw_file_name'}
    ];
    const boolKeys: BoolKey[] = [
      {key: 'bp_ekg', value: 'fyzio_EKG'},
      {key: 'bp_resp', value: 'fyzio_respiration_belt'},
      {key: 'bp_gsr', value: 'fyzio_GSR'},
      {key: 'bp_acc', value: 'fyzio_ACC'},
      {key: 'general_et', value: 'fyzio_pulse_oxymeter'},
      {key: 'general_eeg', value: 'fyzio_external'},
      {key: 'siemens_ekg', value: 'siemens_EKG'},
      {key: 'siemens_resp', value: 'siemens_respiration'},
      {key: 'siemens_pt', value: 'siemens_PT'},
    ];
  
    const pairs: MeasurementTemplatePair[] = [];
    stringKeys.forEach(key => {
      if (measurement[key.value] != '') {
        pairs.push({
          key: key.key,
          user_input: true,
          type_of_comparison: 'equal',
          valueA: measurement[key.value],
          valueB: ''
        });
      }
    });
  
    boolKeys.forEach(key => {
      if (measurement[key.value] == true) {
        pairs.push({
          key: key.key,
          user_input: true,
          type_of_comparison: 'equal',
          valueA: (measurement[key.value] || 'false').toString(),
          valueB: ''
        });
      }
    });
  
    return pairs
  }