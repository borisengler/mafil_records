import axios from 'axios';
import {FormattedMeasurement, FormattedSession, Measurement, Session} from '../../../shared/Types';

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getSession = async (req, res) => {
  const token = req.headers['token'];
  const {study_instance_uuid} = req.params;

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'StudyInstanceUID': study_instance_uuid
    };

    const response = await axios.get(mafilApiUrl + 'sessions', {headers});
    const sessions: Session[] = response.data.results;
    if (sessions.length == 0) {
      res.status(200).json();
      return;
    }
    const session = sessions[0];
    const measurements: FormattedMeasurement[] = session.measurements.filter(
      (measurement) => {
        const mrMeasurementWithSeries = measurement.mr_measurements.filter((m) => m.series_instance_UID && m.series_instance_UID.length > 0);
        return mrMeasurementWithSeries.length > 0
      }).map((measuremnt) => {
      const mrMeasurement = measuremnt.mr_measurements.filter((m) => m.series_instance_UID.length > 0)[0];
      return {
        uuid: measuremnt.uuid,
        log_file_name: measuremnt.log_file_name,
        stimulation_protocol: measuremnt.stimulation_protocol,
        raw_file_name: measuremnt.raw_file_name,
        order_of_measurement: measuremnt.order_of_measurement,
        comment: measuremnt.comment,
        series_instance_UID: mrMeasurement.series_instance_UID,
        study_id: mrMeasurement.study_id,
        fyzio_EKG: mrMeasurement.fyzio_EKG,
        fyzio_respiration_belt: mrMeasurement.fyzio_respiration_belt,
        fyzio_GSR: mrMeasurement.fyzio_GSR,
        fyzio_ACC: mrMeasurement.fyzio_ACC,
        fyzio_pulse_oxymeter: mrMeasurement.fyzio_pulse_oxymeter,
        fyzio_external: mrMeasurement.fyzio_external,
        siemens_EKG: mrMeasurement.siemens_EKG,
        siemens_respiration: mrMeasurement.siemens_respiration,
        siemens_PT: mrMeasurement.siemens_respiration,
        time_of_measurement: new Date(mrMeasurement.time_of_measurement),
        series_description: mrMeasurement.series_description,
        series_number: mrMeasurement.series_number,
        protocol_name: mrMeasurement.protocol_name,
        software_version: mrMeasurement.software_version,
        body_part_examined: mrMeasurement.body_part_examined,
        repetition_time: mrMeasurement.repetition_time,
        flip_angle: mrMeasurement.flip_angle,
        spacing_between_slices: mrMeasurement.spacing_between_slices,
        slice_thickness: mrMeasurement.slice_thickness,
        patient_position: mrMeasurement.patient_position,
        inversion_time: mrMeasurement.inversion_time,
      }
    });
    const result: FormattedSession = {
      studyInstanceUID: session.studyInstanceUID,
      uuid: session.uuid,
      comment: session.comment,
      visit: session.visit,
      measurements: measurements
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({message: 'Error fetching sessions'});
  }
}

export const postSession = async (req, res) => {
  const token = req.headers['token'];

  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const body: FormattedSession = req.body;
    const measurements: Measurement[] = body.measurements ? body.measurements.map((fMeasurement) => {
      return {
        log_file_name: fMeasurement.log_file_name,
        stimulation_protocol: fMeasurement.stimulation_protocol,
        raw_file_name: fMeasurement.raw_file_name,
        order_of_measurement: fMeasurement.order_of_measurement,
        comment: fMeasurement.comment,
        mr_measurements: [{
          series_instance_UID: fMeasurement.series_instance_UID,
          study_id: fMeasurement.study_id,
          fyzio_EKG: fMeasurement.fyzio_EKG,
          fyzio_respiration_belt: fMeasurement.fyzio_respiration_belt,
          fyzio_GSR: fMeasurement.fyzio_GSR,
          fyzio_ACC: fMeasurement.fyzio_ACC,
          fyzio_pulse_oxymeter: fMeasurement.fyzio_pulse_oxymeter,
          fyzio_external: fMeasurement.fyzio_external,
          siemens_EKG: fMeasurement.siemens_EKG,
          siemens_respiration: fMeasurement.siemens_respiration,
          siemens_PT: fMeasurement.siemens_PT,
          time_of_measurement: new Date(fMeasurement.time_of_measurement).toTimeString().split(' ')[0],
          series_description: fMeasurement.series_description,
          series_number: fMeasurement.series_number,
          protocol_name: fMeasurement.protocol_name,
          software_version: fMeasurement.software_version,
          body_part_examined: fMeasurement.body_part_examined,
          repetition_time: fMeasurement.repetition_time,
          flip_angle: fMeasurement.flip_angle,
          spacing_between_slices: fMeasurement.spacing_between_slices,
          slice_thickness: fMeasurement.slice_thickness,
          patient_position: fMeasurement.patient_position,
          inversion_time: fMeasurement.inversion_time,
        }]
      }
    }) : [];
    const requestBody: Session = {
      studyInstanceUID: body.studyInstanceUID,
      visit: body.visit,
      comment: body.comment,
      measurements: measurements
    }

    const response = await axios.post(mafilApiUrl + `sessions`, requestBody, {headers});
    res.status(200).json();
  } catch (error) {
    res.status(500).json({message: 'Error posting session'});
  }
}

export const patchSession = async (req, res) => {
  const {session_uuid} = req.params;
  const token = req.headers['token'];

  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const body: FormattedSession = req.body;
    const measurements: Measurement[] = body.measurements.map((fMeasurement) => {
      return {
        uuid: fMeasurement.uuid,
        log_file_name: fMeasurement.log_file_name,
        stimulation_protocol: fMeasurement.stimulation_protocol,
        raw_file_name: fMeasurement.raw_file_name,
        order_of_measurement: fMeasurement.order_of_measurement,
        comment: fMeasurement.comment,
        mr_measurements: [{
          series_instance_UID: fMeasurement.series_instance_UID,
          study_id: fMeasurement.study_id,
          fyzio_EKG: fMeasurement.fyzio_EKG,
          fyzio_respiration_belt: fMeasurement.fyzio_respiration_belt,
          fyzio_GSR: fMeasurement.fyzio_GSR,
          fyzio_ACC: fMeasurement.fyzio_ACC,
          fyzio_pulse_oxymeter: fMeasurement.fyzio_pulse_oxymeter,
          fyzio_external: fMeasurement.fyzio_external,
          siemens_EKG: fMeasurement.siemens_EKG,
          siemens_respiration: fMeasurement.siemens_respiration,
          siemens_PT: fMeasurement.siemens_PT,
          time_of_measurement: new Date(fMeasurement.time_of_measurement).toTimeString().split(' ')[0],
          series_description: fMeasurement.series_description,
          series_number: fMeasurement.series_number,
          protocol_name: fMeasurement.protocol_name,
          software_version: fMeasurement.software_version,
          body_part_examined: fMeasurement.body_part_examined,
          repetition_time: fMeasurement.repetition_time,
          flip_angle: fMeasurement.flip_angle,
          spacing_between_slices: fMeasurement.spacing_between_slices,
          slice_thickness: fMeasurement.slice_thickness,
          patient_position: fMeasurement.patient_position,
          inversion_time: fMeasurement.inversion_time,
        }]
      }
    });
    const requestBody: Session = {
      studyInstanceUID: body.studyInstanceUID,
      uuid: body.uuid,
      visit: body.visit,
      comment: body.comment,
      measurements: measurements
    }
    const response = await axios.patch(mafilApiUrl + `sessions/${session_uuid}`, requestBody, {headers});
    res.status(200).json();
  } catch (error) {
    res.status(500).json({message: 'Error patching session'});
  }
}