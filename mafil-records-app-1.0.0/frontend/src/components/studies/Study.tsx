import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import CommonCard, { Attribute } from '../common/CommonCard';
import React from 'react';

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

export function Study(props: StudyProps) {
  const {
    StudyInstanceUID,
    AccessionNumber,
    InstitutionName,
    NumberOfStudyRelatedSeries,
    PatientBirthDate,
    PatientID,
    PatientName,
    PatientSex,
    ReferringPhysicianName,
    StudyDate,
    StudyTime,
    StudyDescription,
    StudyID,
  } = props;

  const handleClick = () => {
    localStorage.setItem('currentStudy', JSON.stringify(props));
  };

  return (
    <Link to='/measuring' style={{ textDecoration: 'none' }} onClick={handleClick}>
      <CommonCard>
        <Box>
          <Box m={1} mb={0} display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} gap={3} flexWrap={'wrap'}>

            <Attribute title='Name of patient' text={PatientName} />
            <Attribute title='Visit ID' text={AccessionNumber} />

            <Box color={'grey'} justifyContent='flex-start' fontWeight={'lighter'} fontSize={12}>
              <Box>Date of visit: {StudyDate.toLocaleDateString()}</Box>
            </Box>

          </Box>
        </Box>
      </CommonCard >
    </Link >
  )
}

