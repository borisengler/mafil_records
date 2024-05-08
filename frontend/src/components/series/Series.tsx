import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Icon, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, breadcrumbsClasses} from '@mui/material';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, {useEffect, useState} from 'react';
import CommonCard, {ExpandMore} from '../common/CommonCard';
import {MultiLineInput, MultiLineInputProps, SingleLineInput, SingleLineInputProps} from '../common/Inputs';
import {getSeriesData} from '../../utils/DatabaseFetchers';
import {SeriesData, PACSSeries, SeriesProps, Measurement, FormattedMeasurement} from '../../../../shared/Types';
import {getClockNumberUtilityClass} from '@mui/x-date-pickers/TimeClock/clockNumberClasses';
import {
  Cancel,
  CancelRounded,
  CheckCircle,
  CheckCircleOutline,
  Help,
  HelpRounded,
  Warning,
  WarningRounded
} from '@mui/icons-material';
import {CalendarIcon} from '@mui/x-date-pickers';

export function SeriesSingleLineInput({name, label, value, onChange, type = 'text'}: SingleLineInputProps) {
  return (
    <Box m={1} flexGrow={1}>
      <SingleLineInput
        name={name}
        label={label}
        value={value}
        type={type}
        onChange={onChange}
      />
    </Box>
  );
}

export function SeriesMultiLineInput({name, label, value, onChange}: MultiLineInputProps) {
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


export function Series(props: SeriesProps) {
  type SeriesStateEnum = 'successful' | 'failed' | 'pending';

  function CheckboxInput({text, checked, name}: CheckboxInputProps) {
    return (
      <Box>
        <FormControlLabel control={
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            name={name}
            color='primary'
          />
        } label={text}/>
      </Box>
    )
  }

  useEffect(() => {
    setDisplayData({
      ...displayData,
      is_expanded: props.allExpanded && props.templateSerie === null
    });
  }, [props.allExpanded])
  const [template, setTemplate] = useState('');
  const [measurement, setMeasurement] = useState<FormattedMeasurement | null>(null);

  const [seriesData, setSeriesData] = useState<SeriesData>({
    // Default values
    series_instance_uid: props.validatedSerie ? props.validatedSerie.SeriesInstanceUID : '',
    seq_state: 'pending',
    is_selected: false,
    is_expanded: false,
    measured: new Date(),
    last_updated: new Date(),
    comment: '',
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
    siemens_pt: false,
    validation_status: props.validatedSerie ? props.validatedSerie.ValidationResult : 'MISSING',
  });


  const [displayData, setDisplayData] = useState<SeriesData>({
    // Default values
    series_instance_uid: props.validatedSerie ? props.validatedSerie.SeriesInstanceUID : '',
    seq_state: 'pending',
    is_selected: false,
    is_expanded: false,
    measured: new Date(),
    last_updated: new Date(),
    comment: '',
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
    siemens_pt: false,
    validation_status: props.validatedSerie ? props.validatedSerie.ValidationResult : 'MISSING',
  });

  const [measurementDownloaded, setMeasurementDownloaded] = useState(false);

  useEffect(() => {
    const triggeredByTemplateChange = template != props.choosenTemplate;
    setTemplate(props.choosenTemplate);

    const fetchData = async () => {
      if (props.validatedSerie !== null) {

        const oldSeriesJSON = localStorage.getItem(`series-${props.validatedSerie.SeriesInstanceUID}`);
        const oldSeries = JSON.parse(oldSeriesJSON ? oldSeriesJSON : '{}');
        var newSeriesData: SeriesData = {
          ...seriesData,
          series_instance_uid: props.validatedSerie.SeriesInstanceUID,
        };
        if (oldSeries != undefined) {
          var newSeriesData: SeriesData = {
            ...seriesData,
            is_expanded: oldSeries.is_expanded,
            is_selected: oldSeries.is_selected,
            series_instance_uid: props.validatedSerie.SeriesInstanceUID,
          };
          if (!triggeredByTemplateChange) {
            newSeriesData = {
              ...newSeriesData,
              seq_state: oldSeries.seq_state,
              measured: oldSeries.measured,
              last_updated: oldSeries.last_updated,
              comment: oldSeries.comment,
              stim_protocol: oldSeries.stim_protocol,
              stim_log_file: oldSeries.stim_log_file,
              fyzio_raw_file: oldSeries.fyzio_raw_file,
              general_eeg: oldSeries.general_eeg,
              general_et: oldSeries.general_et,
              bp_ekg: oldSeries.bp_ekg,
              bp_resp: oldSeries.bp_resp,
              bp_gsr: oldSeries.bp_gsr,
              bp_acc: oldSeries.bp_acc,
              siemens_ekg: oldSeries.siemens_ekg,
              siemens_resp: oldSeries.siemens_resp,
              siemens_pt: oldSeries.siemens_pt
            }
          } else {
            newSeriesData.validation_status = props.validatedSerie ? props.validatedSerie.ValidationResult : 'MISSING';
            props.validatedSerie.UserInput.forEach(element => {
              if ((element.key == 'stim_protocol' || element.key == 'stim_log_file' || element.key == 'fyzio_raw_file') && element.valueA !== null) {
                if (element.valueA.length > 0) newSeriesData[element.key] = element.valueA;
              } else if ((element.key == 'general_eeg' || element.key == 'general_et' || element.key == 'bp_ekg'
                || element.key == 'bp_resp' || element.key == 'bp_gsr' || element.key == 'bp_acc'
                || element.key == 'siemens_ekg' || element.key == 'siemens_resp' || element.key == 'siemens_pt')
              ) {
                newSeriesData[element.key] = element.valueA == 'true';
              }
            });

          }
        }

        if (props.downloadedMeasurement) {
          if (!measurementDownloaded) {
            setDisplayData({
              series_instance_uid: props.validatedSerie ? props.validatedSerie.SeriesInstanceUID : '',
              seq_state: displayData.seq_state,
              is_selected: displayData.is_selected,
              is_expanded: displayData.is_expanded,
              measured: props.downloadedMeasurement.time_of_measurement ? props.downloadedMeasurement.time_of_measurement : newSeriesData.measured,
              last_updated: newSeriesData.last_updated,
              comment: props.downloadedMeasurement.comment,
              stim_protocol: props.downloadedMeasurement.stimulation_protocol,
              stim_log_file: props.downloadedMeasurement.log_file_name,
              fyzio_raw_file: props.downloadedMeasurement.raw_file_name,
              general_eeg: newSeriesData.general_eeg,
              general_et: newSeriesData.general_et,
              bp_ekg: props.downloadedMeasurement.fyzio_EKG ? props.downloadedMeasurement.fyzio_EKG : newSeriesData.bp_ekg,
              bp_resp: props.downloadedMeasurement.fyzio_respiration_belt ? props.downloadedMeasurement.fyzio_respiration_belt : newSeriesData.bp_resp,
              bp_gsr: props.downloadedMeasurement.fyzio_GSR ? props.downloadedMeasurement.fyzio_GSR : newSeriesData.bp_gsr,
              bp_acc: props.downloadedMeasurement.fyzio_ACC ? props.downloadedMeasurement.fyzio_ACC : newSeriesData.bp_acc,
              siemens_ekg: props.downloadedMeasurement.siemens_EKG ? props.downloadedMeasurement.siemens_EKG : newSeriesData.siemens_ekg,
              siemens_resp: props.downloadedMeasurement.siemens_respiration ? props.downloadedMeasurement.siemens_respiration : newSeriesData.siemens_resp,
              siemens_pt: props.downloadedMeasurement.siemens_PT ? props.downloadedMeasurement.siemens_PT : newSeriesData.siemens_pt,
              validation_status: props.validatedSerie ? props.validatedSerie.ValidationResult : 'MISSING',
            });
          }
          setMeasurementDownloaded(true);
        } else {
          setDisplayData(newSeriesData);
        }
      }
    };
    fetchData();
  }, [props.downloadedMeasurement, props.validatedSerie]);

  useEffect(() => {
    if (props.validatedSerie !== null) {
      localStorage.setItem(`series-${props.validatedSerie.SeriesInstanceUID}`, JSON.stringify(displayData))
      props.onChange(displayData);
    }
  }, [displayData]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayData({
      ...displayData,
      [event.target.name]: event.target.checked,
      last_updated: new Date(),
    });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setDisplayData({
      ...displayData,
      [name]: value,
      last_updated: new Date(),
    });
  };

  function handleSeqStateChange(event: SelectChangeEvent<unknown>) {
    setDisplayData({
      ...displayData,
      seq_state: event.target.value as SeriesStateEnum,
      last_updated: new Date(),
    });
  }

  function handleSeriesClick() {
    setDisplayData({
      ...displayData,
      is_expanded: !displayData.is_expanded
    });
  }

  const handleSeriesCopy = () => {
    if (props.validatedSerie !== null && props.validatedSerie.SeriesInstanceUID !== null) {
      setDisplayData({
        ...displayData,
        is_selected: !displayData.is_selected
      });
      props.onCopy(`series-${props.validatedSerie.SeriesInstanceUID}`); // invoke parent onCopy handler
    }
  };

  const handleSeriesPaste = () => {
    const copyFromSeriesId = props.onPaste();
    if (copyFromSeriesId != null) {
      const copyFromSeriesStr = localStorage.getItem(copyFromSeriesId);
      const copy = copyFromSeriesStr ? JSON.parse(copyFromSeriesStr) : {}

      setDisplayData({
        ...displayData,
        comment: copy.comment,
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
        siemens_pt: copy.siemens_pt,
      });
    }
  };

  function getPaperBackgroundColor() {
    switch (displayData.seq_state) {
      case 'pending':
        return ('rgb(250, 250, 250);')
      case 'failed':
        return ('rgb(255, 230, 230);')
      case 'successful':
        return ('rgb(230, 255, 230);')
    }
  }

  function getSelectColor() {
    switch (displayData.seq_state) {
      case 'pending':
        return ('grey')
      case 'failed':
        return ('red');
      case 'successful':
        return ('green');
    }
  }

  function getIcon() {
    if (props.validatedSerie) {
      switch (props.validatedSerie.ValidationResult) {
        case 'OK':
          return <CheckCircle/>;
        case 'NOK':
          return <CancelRounded/>;
        case 'NOT_FOUND':
          return <HelpRounded/>;
      }
    }
    return <WarningRounded/>;
  }

  function getIconText() {
    if (props.validatedSerie) {
      switch (props.validatedSerie.ValidationResult) {
        case 'OK':
          return 'Valid';
        case 'NOK':
          const elements = props.validatedSerie.InvalidReasons.map((reason) => <React.Fragment
            key={reason}>{reason}<br/></React.Fragment>);
          return <Box flexDirection={'column'}>{elements}</Box>;
        case 'NOT_FOUND':
          return 'Not found in template';
      }
    }
    return 'Missing to fill template';
  }

  const description = props.validatedSerie ? props.validatedSerie.SeriesDescription : (props.templateSerie ? props.templateSerie.SeriesDescription : '');
  const seriesNumber = props.validatedSerie ? props.validatedSerie.SeriesNumber : '';

  const measured = props.validatedSerie !== null ? displayData.measured.toLocaleString() : '-';
  const last_updated = props.validatedSerie !== null ? displayData.last_updated.toLocaleString() : '-';
  const num_of_instances = props.validatedSerie !== null ? props.validatedSerie.NumberOfSeriesRelatedInstances : '-';

  const disableInteractions = props.validatedSerie === null;

  return (
    <CommonCard>
      <Box>
        <Box m={1} mb={0} display={'flex'} justifyContent={'space-between'} flexDirection={'row'} flexWrap={'wrap'}>

          <Box
            fontWeight={'bold'}
            width={Math.max(38, description.length + seriesNumber.toString.length) + 'ch'}
            fontSize={18}
            whiteSpace={'break-spaces'}
          >
            {`${seriesNumber ? seriesNumber + ' | ' : ''}`}{description}
          </Box>

          <Box color={'grey'} justifyContent='flex-start' fontWeight={'lighter'} fontSize={12} width={'38ch'}>
            <Box>Measured: {measured}</Box>
            <Box>Last updated: {last_updated}</Box>
            <Box>Number of instances: {num_of_instances}</Box>
          </Box>

          <Box display={'flex'} justifyContent='flex-start' flexDirection={'row'}>
            <CardActions disableSpacing>
              <Tooltip title={'Select this measurement for copying of records'}>
                <span>
                  <IconButton size='large' onClick={handleSeriesCopy} disabled={disableInteractions}>
                    <ContentCopyIcon/>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={'Paste records from the selected measurement into this one'}>
                <span>
                  <IconButton size='large' onClick={handleSeriesPaste} disabled={disableInteractions}>
                    <ContentPasteIcon/>
                  </IconButton>
                </span>
              </Tooltip>
            </CardActions>
          </Box>
          <Box minWidth={140} sx={{
            background: getPaperBackgroundColor,
          }}>
            <span>
              <Select fullWidth
                      defaultValue={'pending'}
                      value={displayData.seq_state}
                      onChange={handleSeqStateChange}
                      sx={{color: getSelectColor}}
                      disabled={disableInteractions}
              >
                <MenuItem value={'successful'}>Successful</MenuItem>
                <MenuItem value={'failed'}>Failed</MenuItem>
                <MenuItem value={'pending'}>Pending</MenuItem>
              </Select>
            </span>
          </Box>
          <Box display={'flex'} justifyContent='flex-start' flexDirection={'row'}>
            <CardActions disableSpacing>
              <Tooltip title={getIconText()}>
                <Icon>
                  {getIcon()}
                </Icon>
              </Tooltip>
            </CardActions>
          </Box>
          <CardActions disableSpacing>
            <span>
              <ExpandMore
                expand={displayData.is_expanded}
                onClick={handleSeriesClick}
                aria-expanded={displayData.is_expanded}
                disabled={disableInteractions}
              >
                <ExpandMoreIcon/>
              </ExpandMore>
            </span>
          </CardActions>

        </Box>

        <Collapse in={displayData.is_expanded} timeout='auto' unmountOnExit>
          <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
            <SeriesSingleLineInput label='Stim. protocol' name='stim_protocol' value={displayData.stim_protocol}
                                   onChange={handleTextChange}/>
            <SeriesSingleLineInput label='Stim. log file' name='stim_log_file' value={displayData.stim_log_file}
                                   onChange={handleTextChange}/>
            <SeriesSingleLineInput label='Fyzio raw file (for BP)' name='fyzio_raw_file'
                                   value={displayData.fyzio_raw_file} onChange={handleTextChange}/>
            <Box sx={{width: '80ch'}}>
              <SeriesMultiLineInput label='Comment' name='comment' value={displayData.comment}
                                    onChange={handleTextChange}/>
            </Box>
            <Box m={1}>
              <Box
                sx={{
                  fontWeight: 'bold'
                }}
              >
                General
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                <CheckboxInput text='EEG' checked={displayData.general_eeg} name='general_eeg'/>
                <CheckboxInput text='ET' checked={displayData.general_et} name='general_et'/>
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
                <CheckboxInput text='EKG' checked={displayData.bp_ekg} name='bp_ekg'/>
                <CheckboxInput text='Resp.' checked={displayData.bp_resp} name='bp_resp'/>
                <CheckboxInput text='GSR' checked={displayData.bp_gsr} name='bp_gsr'/>
                <CheckboxInput text='ACC' checked={displayData.bp_acc} name='bp_acc'/>
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
                <CheckboxInput text='EKG' checked={displayData.siemens_ekg} name='siemens_ekg'/>
                <CheckboxInput text='Resp.' checked={displayData.siemens_resp} name='siemens_resp'/>
                <CheckboxInput text='PT' checked={displayData.siemens_pt} name='siemens_pt'/>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </CommonCard>
  )
}
