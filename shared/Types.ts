export interface Template {
  id: number;
  name: string;
  order_for_displaying: number | null;
  measurement_modality: 'MR' | 'EF';
  versioned_templates?: VersionedTemplate[];
  project: Project;
  is_default: boolean;
}

export interface VersionedTemplate {
  version: number,
  comment: string;
  measurement_templates?: MeasurementTemplate[];
  createdFrom?: Session;
}

export interface MeasurementTemplate {
  id?: number;
  name: string;
  order_for_displaying: number | null;
  compulsory: boolean;
  comment: string;
  measurement_template_pairs: MeasurementTemplatePair[];
}

export interface MeasurementTemplatePair {
  key: string;
  key_source?: string;
  user_input: boolean;
  type_of_comparison: 'equal' | 'range';
  valueA: string;
  valueB: string;
}

export interface FormattedTemplate {
  id: string;
  name: string;
  version: number;
  is_default: boolean;
  order_for_displaying: number | null;
  comment: string;
  measurementTemplates: MeasurementTemplate[];
  project_uuid: string;
  project_name: string;
}

export interface PacsStudyAPI {
  StudyInstanceUID: string;
  AccessionNumber: string;
  InstitutionName: string;
  NumberOfStudyRelatedSeries: number | null;
  PatientBirthDate: string;
  PatientID: string;
  PatientName: string;
  PatientSex: string;
  ReferringPhysicianName: string;
  StudyDate: string;
  StudyTime: string;
  StudyDescription: string;
  StudyID: string;
}

export interface PacsStudy {
  StudyInstanceUID: string;
  AccessionNumber: string;
  InstitutionName: string;
  NumberOfStudyRelatedSeries: number | null;
  PatientBirthDate: string;
  PatientID: string;
  PatientName: string;
  PatientSex: string;
  ReferringPhysicianName: string;
  StudyDate: Date;
  StudyTime: string;
  StudyDescription: string;
  StudyID: string;

}

export interface SeriesData {
  series_instance_uid: string;
  seq_state: string;
  is_selected: boolean;
  is_expanded: boolean;
  measured: Date;
  last_updated: Date;
  comment: string;
  stim_protocol: string;
  stim_log_file: string;
  fyzio_raw_file: string;
  general_eeg: boolean;
  general_et: boolean;
  bp_ekg: boolean;
  bp_resp: boolean;
  bp_gsr: boolean;
  bp_acc: boolean;
  siemens_ekg: boolean;
  siemens_resp: boolean;
  siemens_pt: boolean;
  validation_status: 'OK' | 'NOK' | 'NOT_FOUND' | 'MISSING';
}

export interface PACSSeries {
  SeriesInstanceUID: string;
  SequenceFileName: string;
  AcquisitionMatrix: number[];
  BodyPartExamined: string;
  FlipAngle: string;
  ImageType: string[];
  InversionTime: number | null;
  NumberOfSeriesRelatedInstances: number;
  OperatorsName: string;
  PAT: string;
  PatientPosition: string;
  PercentPhaseFieldOfView: string;
  ProtocolName: string;
  RepetitionTime: string;
  SOPClassUID: string;
  SeriesDescription: string;
  SeriesNumber: number;
  SeriesTime: string;
  SliceThickness: string;
  SoftwareVersions: string;
  SpacingBetweenSlices: number | null;
  StationName: string;
}


export interface ValidatedSeries {
  ValidationResult: 'OK' | 'NOK' | 'NOT_FOUND';
  UserInput: MeasurementTemplatePair[];
  InvalidReasons: string[];
  OrderForDisplaying: number;
  SeriesInstanceUID: string;
  SequenceFileName: string;
  AcquisitionMatrix: number[];
  BodyPartExamined: string;
  FlipAngle: string;
  ImageType: string[];
  InversionTime: number | null;
  NumberOfSeriesRelatedInstances: number;
  OperatorsName: string;
  PAT: string;
  PatientPosition: string;
  PercentPhaseFieldOfView: string;
  ProtocolName: string;
  RepetitionTime: string;
  SOPClassUID: string;
  SeriesDescription: string;
  SeriesNumber: number;
  SeriesTime: string;
  SliceThickness: string;
  SoftwareVersions: string;
  SpacingBetweenSlices: number | null;
  StationName: string;
}

export interface MissingSeries {
  ValidationResult: 'MISSING';
  UserInput: MeasurementTemplatePair[],
  SeriesDescription: string;
  OrderForDisplaying: number;
}

export interface SeriesProps {
  order?: number;
  validatedSerie: ValidatedSeries | null;
  templateSerie: MissingSeries | null;
  downloadedMeasurement: FormattedMeasurement | null;
  onCopy: (seriesId: string) => void; // onCopy handler passed from parent component
  onPaste: () => string | null; // onPaste handler passed from parent component
  allExpanded: boolean;
  choosenTemplate: string;
  onChange: (measurement: SeriesData, order?: number) => void;
  visitId: string;
  projectAcronym: string;
}

export interface Project {
  uuid: string;
  acronym: string;
}

export interface Session {
  uuid?: string;
  visit: string;
  comment: string;
  measurements: Measurement[];
  studyInstanceUID: string;
}

export interface Measurement {
  uuid?: string;
  log_file_name: string;
  stimulation_protocol: string;
  raw_file_name: string;
  order_of_measurement: number;
  comment: string
  mr_measurements: MrMeasurement[];
}

export interface MrMeasurement {
  series_instance_UID: string | undefined;
  study_id: string | undefined;
  fyzio_EKG: boolean | undefined;
  fyzio_respiration_belt: boolean | undefined;
  fyzio_GSR: boolean | undefined;
  fyzio_ACC: boolean | undefined;
  fyzio_pulse_oxymeter: boolean | undefined;
  fyzio_external: boolean | undefined;
  siemens_EKG: boolean | undefined;
  siemens_respiration: boolean | undefined;
  siemens_PT: boolean | undefined;
  time_of_measurement: string | undefined;
  series_description: string | undefined;
  series_number: number | undefined;
  protocol_name: string | undefined;
  software_version: string | undefined;
  body_part_examined: string | undefined;
  repetition_time: string | undefined;
  flip_angle: string | undefined;
  spacing_between_slices: number | null;
  slice_thickness: string | undefined;
  patient_position: string | undefined;
  inversion_time: number | null;
}

export interface FormattedSession {
  uuid: string;
  studyInstanceUID: string;
  visit: string;
  comment: string;
  measurements: FormattedMeasurement[];
}

export interface FormattedMeasurement {
  uuid?: string;
  log_file_name: string;
  stimulation_protocol: string;
  raw_file_name: string;
  order_of_measurement: number;
  comment: string;
  series_instance_UID: string | undefined;
  study_id: string | undefined;
  fyzio_EKG: boolean | undefined;
  fyzio_respiration_belt: boolean | undefined;
  fyzio_GSR: boolean | undefined;
  fyzio_ACC: boolean | undefined;
  fyzio_pulse_oxymeter: boolean | undefined;
  fyzio_external: boolean | undefined;
  siemens_EKG: boolean | undefined;
  siemens_respiration: boolean | undefined;
  siemens_PT: boolean | undefined;
  time_of_measurement: Date | undefined;
  series_description: string | undefined;
  series_number: number | undefined;
  protocol_name: string | undefined;
  software_version: string | undefined;
  body_part_examined: string | undefined;
  repetition_time: string | undefined;
  flip_angle: string | undefined;
  spacing_between_slices: number | null;
  slice_thickness: string | undefined;
  patient_position: string | undefined;
  inversion_time: number | null;
}

export interface StudyProps {
  StudyInstanceUID: string;
  AccessionNumber: string;
  InstitutionName: string;
  NumberOfStudyRelatedSeries: number | null;
  PatientBirthDate: string;
  PatientID: string;
  PatientName: string;
  PatientSex: string;
  ReferringPhysicianName: string;
  StudyDate: Date;
  StudyTime: string;
  StudyDescription: string;
  StudyID: string;
}

export interface CheckboxInputProps {
  text: string;
  checked: boolean;
  name: string;
  disabled?: boolean;
}