import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useEffect, useState } from 'react';
import CommonCard, { ExpandMore } from '../common/CommonCard';
import { MultiLineInput, MultiLineInputProps, SingleLineInput, SingleLineInputProps } from '../common/Inputs';
import { getSeriesData } from '../../utils/DatabaseFetchers';

export function SeriesSingleLineInput({ name, label, value, onChange }: SingleLineInputProps) {
  return (
    <Box m={1} flexGrow={1}>
      <SingleLineInput
        name={name}
        label={label}
        value={value}
        onChange={onChange}
      />
    </Box >
  );
}

export function SeriesMultiLineInput({ name, label, value, onChange }: MultiLineInputProps) {
  return (
    <Box m={1} flexGrow={1}>
      <MultiLineInput
        name={name}
        label={label}
        value={value}
        onChange={onChange}
      />
    </Box>
  )
}

interface CheckboxInputProps {
  text: string;
  checked: boolean;
  name: string;
}

export interface SeriesProps {
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
  onCopy: (seriesId: string) => void; // onCopy handler passed from parent component
  onPaste: () => string | null; // onPaste handler passed from parent component
}


export interface SeriesData {
  series_instance_uid: string;
  seq_state: string;
  is_selected: boolean;
  is_expanded: boolean;
  measured: Date;
  last_updated: Date;
  measurement_notes: string;
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
  siemens_gsr: boolean;
  siemens_acc: boolean;
}

export function Series(props: SeriesProps) {
  type SeriesStateEnum = 'successful' | 'failed' | 'pending';

  function CheckboxInput({ text, checked, name }: CheckboxInputProps) {
    return (
      <Box>
        <FormControlLabel control={
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            name={name}
            color="primary"
          />
        } label={text} />
      </Box>
    )
  }

  const [seriesData, setSeriesData] = useState<SeriesData>({
    // Default values
    series_instance_uid: props.SeriesInstanceUID,
    seq_state: 'pending',
    is_selected: false,
    is_expanded: false,
    measured: new Date(),
    last_updated: new Date(),
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
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSeriesData = await getSeriesData(props.SeriesInstanceUID);
      setSeriesData(fetchedSeriesData);
    };

    fetchData();
  }, [props.SeriesInstanceUID]);

  useEffect(() => {
    localStorage.setItem(`series-${props.SeriesInstanceUID}`, JSON.stringify(seriesData))
  }, [seriesData]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeriesData({
      ...seriesData,
      [event.target.name]: event.target.checked,
      last_updated: new Date(),
    });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSeriesData({
      ...seriesData,
      [name]: value,
      last_updated: new Date(),
    });
  };

  function handleSeqStateChange(event: SelectChangeEvent<unknown>) {
    setSeriesData({
      ...seriesData,
      seq_state: event.target.value as SeriesStateEnum,
      last_updated: new Date(),
    });
  }

  function handleSeriesClick() {
    setSeriesData({
      ...seriesData,
      is_expanded: !seriesData.is_expanded
    });
  }

  const handleSeriesCopy = () => {
    setSeriesData({
      ...seriesData,
      is_selected: !seriesData.is_selected
    });
    props.onCopy(`series-${props.SeriesInstanceUID}`); // invoke parent onCopy handler
  };

  const handleSeriesPaste = () => {
    const copyFromSeriesId = props.onPaste();
    if (copyFromSeriesId != null) {
      const copyFromSeriesStr = localStorage.getItem(copyFromSeriesId);
      const copy = copyFromSeriesStr ? JSON.parse(copyFromSeriesStr) : {}

      setSeriesData({
        ...seriesData,
        measurement_notes: copy.measurement_notes,
        last_updated: new Date(),
        stim_protocol: copy.stim_protocol,
        stim_log_file: copy.stim_log_file,
        fyzio_raw_file: copy.fyzio_raw_file,
        general_eeg: copy.general_eeg,
        general_et: copy.general_et,
        bp_ekg: copy.bp_ekg,
        bp_resp: copy.bp_resp,
        bp_gsr: copy.bp_gsr,
        bp_acc: copy.bp_acc,
        siemens_ekg: copy.siemens_ekg,
        siemens_resp: copy.siemens_resp,
        siemens_gsr: copy.siemens_gsr,
        siemens_acc: copy.siemens_acc,
      });
    }
  };

  function getPaperBackgroundColor() {
    switch (seriesData.seq_state) {
      case 'pending':
        return ('rgb(250, 250, 250);')
      case 'failed':
        return ('rgb(255, 230, 230);')
      case 'successful':
        return ('rgb(230, 255, 230);')
    }
  }

  function getSelectColor() {
    switch (seriesData.seq_state) {
      case 'pending':
        return ('grey')
      case 'failed':
        return ('red');
      case 'successful':
        return ('green');
    }
  }

  return (
    <CommonCard>
      <Box>
        <Box m={1} mb={0} display={'flex'} justifyContent={'space-between'} flexDirection={'row'} flexWrap={'wrap'}>

          <Box
            fontWeight={'bold'}
            width={Math.max(38, props.SeriesDescription.length + props.SeriesNumber.toString.length) + 'ch'}
            fontSize={18}
            whiteSpace={'break-spaces'}
          >
            {props.SeriesNumber} | {props.SeriesDescription}
          </Box>

          <Box color={'grey'} justifyContent='flex-start' fontWeight={'lighter'} fontSize={12}>
            <Box>Measured: {seriesData.measured.toLocaleString()}</Box>
            <Box>Last updated: {seriesData.last_updated.toLocaleString()}</Box>
            <Box>Number of instances: {props.NumberOfSeriesRelatedInstances}</Box>
          </Box>

          <Box display={'flex'} justifyContent='flex-start' flexDirection={'row'}>
            <CardActions disableSpacing>
              <Tooltip title={'Select this measurement for copying of records'}>
                <IconButton size='large' onClick={handleSeriesCopy}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={'Paste records from the selected measurement into this one'}>
                <IconButton size='large' onClick={handleSeriesPaste}>
                  <ContentPasteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Box>
          <Box minWidth={140} sx={{
            background: getPaperBackgroundColor,
          }}>
            <Select fullWidth
              defaultValue={'pending'}
              value={seriesData.seq_state}
              onChange={handleSeqStateChange}
              sx={{ color: getSelectColor }}
            >
              <MenuItem value={'successful'}>Successful</MenuItem>
              <MenuItem value={'failed'}>Failed</MenuItem>
              <MenuItem value={'pending'}>Pending</MenuItem>
            </Select>
          </Box>
          <CardActions disableSpacing>
            <ExpandMore
              expand={seriesData.is_expanded}
              onClick={handleSeriesClick}
              aria-expanded={seriesData.is_expanded}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>

        </Box>

        <Collapse in={seriesData.is_expanded} timeout="auto" unmountOnExit>
          <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
            <SeriesSingleLineInput label='Stim. protocol' name='stim_protocol' value={seriesData.stim_protocol} onChange={handleTextChange} />
            <SeriesSingleLineInput label='Stim. log file' name='stim_log_file' value={seriesData.stim_log_file} onChange={handleTextChange} />
            <SeriesSingleLineInput label='Fyzio raw file (for BP)' name='fyzio_raw_file' value={seriesData.fyzio_raw_file} onChange={handleTextChange} />
            <SeriesMultiLineInput label='Measurement notes' name='measurement_notes' value={seriesData.measurement_notes} onChange={handleTextChange} />
            <Box m={1}>
              <Box
                sx={{
                  fontWeight: 'bold'
                }}
              >
                General
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                <CheckboxInput text='EEG' checked={seriesData.general_eeg} name="general_eeg" />
                <CheckboxInput text='ET' checked={seriesData.general_et} name="general_et" />
              </Box>
            </Box>
            <Box m={1}>
              <Box
                sx={{
                  fontWeight: 'bold'
                }}
              >
                BP ExG
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                <CheckboxInput text='EKG' checked={seriesData.bp_ekg} name="bp_ekg" />
                <CheckboxInput text='Resp.' checked={seriesData.bp_resp} name="bp_resp" />
                <CheckboxInput text='GSR' checked={seriesData.bp_gsr} name="bp_gsr" />
                <CheckboxInput text='ACC' checked={seriesData.bp_acc} name="bp_acc" />
              </Box>
            </Box>
            <Box m={1}>
              <Box
                sx={{
                  fontWeight: 'bold'
                }}
              >
                Siemens
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                <CheckboxInput text='EKG' checked={seriesData.siemens_ekg} name="siemens_ekg" />
                <CheckboxInput text='Resp.' checked={seriesData.siemens_resp} name="siemens_resp" />
                <CheckboxInput text='GSR' checked={seriesData.siemens_gsr} name="siemens_gsr" />
                <CheckboxInput text='ACC' checked={seriesData.siemens_acc} name="siemens_acc" />
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </CommonCard >
  )
}
