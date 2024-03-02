
export interface Template {
  name: string;
  order_for_displaying: number | null;
  measurement_modality: "MR" | "EF";
  comment: string | null;
  measurementTemplates?: MeasurementTemplate[];
}

export interface MeasurementTemplate {
  name: string;
  order_for_displaying: number | null;
  compulsory: boolean;
  comment: string | null;
  measurementTemplatePairs?: MeasurementTemplatePair[];
}

export interface MeasurementTemplatePair {
  key: string;
  key_source?: string | null;
  user_input: boolean;
  type_of_comparison: "equal" | "range";
  valueA: string | null;
  valueB: string | null;
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