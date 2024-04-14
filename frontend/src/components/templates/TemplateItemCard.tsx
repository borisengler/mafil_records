import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, breadcrumbsClasses } from '@mui/material';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useEffect, useState } from 'react';
import CommonCard, { ExpandMore } from '../common/CommonCard';
import { MultiLineInput, MultiLineInputProps, SingleLineInput, SingleLineInputProps } from '../common/Inputs';
import { getSeriesData } from '../../utils/DatabaseFetchers';
import { SeriesData, PACSSeries, SeriesProps, FormattedTemplate, MeasurementTemplate, MeasurementTemplatePair } from "../../../../shared/Types";
import { getClockNumberUtilityClass } from '@mui/x-date-pickers/TimeClock/clockNumberClasses';
import { Cancel, CancelRounded, CheckCircle, CheckCircleOutline, Help, HelpRounded, Warning, WarningRounded } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { SeriesMultiLineInput, SeriesSingleLineInput } from '../series/Series';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteDialog } from './DeleteDialog';

interface CheckboxInputProps {
  text: string;
  checked: boolean;
  name: string;
}

export interface TemplateItemProps {
    template: MeasurementTemplate,
    onDelete: (name: string) => void    
}

export function TemplateItemCard(props: TemplateItemProps) {

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

  const [template, setTemplate] = useState<MeasurementTemplate>(props.template);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  useEffect(() => {
    const fetchData = async () => {
    };
    // TODO

    fetchData();
  }, []);

  const onDeleteClick = (name: string) => {
    setItemToDelete(name)
    setIsDeleteDialogOpen(true);
  }

  const deleteItem = () => {
    props.onDelete(itemToDelete);
    setIsDeleteDialogOpen(false);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
    setItemToDelete("");
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const index = template.measurement_template_pairs.findIndex(pair => pair.key === name);
    if (index === -1) {
      const new_pair: MeasurementTemplatePair = {
        key: name,
        user_input: true,
        type_of_comparison: "equal",
        valueA: event.target.checked.toString(),
        valueB: null
      }
      setTemplate(prevTemplate => ({...prevTemplate, measurement_template_pairs: [...prevTemplate.measurement_template_pairs, new_pair]}))
    } else {
      const updatedTemplate = { ...template };
      updatedTemplate.measurement_template_pairs[index] = {
        ...updatedTemplate.measurement_template_pairs[index],
        valueA: event.target.checked.toString(),
      }
      setTemplate(updatedTemplate);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const index = template.measurement_template_pairs.findIndex(pair => pair.key === name);
    if (index === -1) {
      const new_pair: MeasurementTemplatePair = {
        key: name,
        user_input: true,
        type_of_comparison: "equal",
        valueA: value,
        valueB: null
      }
      setTemplate(prevTemplate => ({...prevTemplate, measurement_template_pairs: [...prevTemplate.measurement_template_pairs, new_pair]}))
    } else {
      const updatedTemplate = { ...template };
      updatedTemplate.measurement_template_pairs[index] = {
        ...updatedTemplate.measurement_template_pairs[index],
        valueA: value,
      }
      setTemplate(updatedTemplate);
    }
  };

  function handleSeriesClick() {
    setIsExpanded(!isExpanded);
  }
  const description = props.template.name;
  const seriesNumber = props.template.order_for_displaying ? props.template.order_for_displaying : 0;

  function isChecked(value: string) {
    const pair = template.measurement_template_pairs.find(pair => pair.key === value);
    return pair !== undefined && pair.valueA === "true";
  }

  function getStringValue(value: string) {
    const pair = template.measurement_template_pairs.find(pair => pair.key === value);
    if (pair === undefined) {
      return "";
    }
    return pair.valueA ? pair.valueA : "";
  }

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
            {description}
          </Box>
          <CardActions disableSpacing>
            <span>
            <IconButton
              aria-label="delete"
              onClick={() => onDeleteClick(props.template.name)}
            >
              <DeleteIcon />
            </IconButton>
              <ExpandMore
                expand={isExpanded}
                onClick={handleSeriesClick}
                aria-expanded={isExpanded}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </span>
          </CardActions>

        </Box>

        <DeleteDialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} onConfirm={deleteItem}></DeleteDialog>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
            <SeriesSingleLineInput label='Stim. protocol' name='stim_protocol' value={getStringValue("stim_protocol")} onChange={handleTextChange} />
            <SeriesSingleLineInput label='Stim. log file' name='stim_log_file' value={getStringValue("stim_log_file")} onChange={handleTextChange} />
            <SeriesSingleLineInput label='Fyzio raw file (for BP)' name='fyzio_raw_file' value={getStringValue("fyzio_raw_file")} onChange={handleTextChange} />
            <SeriesMultiLineInput label='Measurement notes' name='measurement_notes' value={getStringValue("measurement_notes")} onChange={handleTextChange} />
            <Box m={1}>
              <Box
                sx={{
                  fontWeight: 'bold'
                }}
              >
                General
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                <CheckboxInput text='EEG' checked={isChecked("general_eeg")} name="general_eeg" />
                <CheckboxInput text='ET' checked={isChecked("general_et")} name="general_et" />
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
                <CheckboxInput text='EKG' checked={isChecked("bp_ekg")} name="bp_ekg" />
                <CheckboxInput text='Resp.' checked={isChecked("bp_resp")} name="bp_resp" />
                <CheckboxInput text='GSR' checked={isChecked("bp_gsr")} name="bp_gsr" />
                <CheckboxInput text='ACC' checked={isChecked("bp_acc")} name="bp_acc" />
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
                <CheckboxInput text='EKG' checked={isChecked("siemens_ekg")} name="siemens_ekg" />
                <CheckboxInput text='Resp.' checked={isChecked("siemens_resp")} name="siemens_resp" />
                <CheckboxInput text='GSR' checked={isChecked("siemens_gsr")} name="siemens_gsr" />
                <CheckboxInput text='ACC' checked={isChecked("siemens_acc")} name="siemens_acc" />
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </CommonCard >
  )
}
