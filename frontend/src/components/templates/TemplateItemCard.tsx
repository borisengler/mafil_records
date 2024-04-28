import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Icon, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, breadcrumbsClasses } from '@mui/material';
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
import { Cancel, CancelRounded, CheckCircle, CheckCircleOutline, Filter, Help, HelpRounded, PaidRounded, Warning, WarningRounded } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { SeriesMultiLineInput, SeriesSingleLineInput } from '../series/Series';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteDialog } from './DeleteDialog';
import AddIcon from '@mui/icons-material/Add';
import TemplatePairCard from './TemplatePairCard';
import ListItems from '../common/ListItems';

interface CheckboxInputProps {
  text: string;
  checked: boolean;
  name: string;
}

export interface TemplateItemProps {
    template: MeasurementTemplate,
    onDelete: (name: string) => void,
    onChange: (template: MeasurementTemplate) => any
}

export interface AddedMeasurementTemplatePairs {
  index: number;
  pair: MeasurementTemplatePair
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

  const [addedPairsIndex, setAddedPairsIndex] = useState(0);
  const [addedPairs, setAddedPairs] = useState<AddedMeasurementTemplatePairs[]>(() => {
    var pairs: AddedMeasurementTemplatePairs[] = []
    props.template.measurement_template_pairs.filter((pair) => !pair.user_input).forEach(pair => {
      pairs = [...pairs, {index: addedPairsIndex, pair: pair}]
      setAddedPairsIndex((prev) => prev + 1);
    });
    return pairs;
  });

  useEffect(() => {
    props.onChange(template);
  }, [template])

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

  const onAddTemplateClick = () => {
    const new_pair: MeasurementTemplatePair = {
      key: "",
      user_input: false,
      type_of_comparison: "equal",
      valueA: '',
      valueB: ''
    }
    setAddedPairs((prev) => [...prev, {index: addedPairsIndex, pair: new_pair}]);
    setAddedPairsIndex((prev) => prev+1);
    setTemplate(prevTemplate => ({...prevTemplate, measurement_template_pairs: [...prevTemplate.measurement_template_pairs, new_pair]}))
    console.log({...template, measurement_template_pairs: [...template.measurement_template_pairs, new_pair]});
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
        valueB: ''
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

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTemplate({...template, comment: value});
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const index = template.measurement_template_pairs.findIndex(pair => pair.key === name);
    if (index === -1) {
      const new_pair: MeasurementTemplatePair = {
        key: name,
        user_input: true,
        type_of_comparison: "equal",
        valueA: value,
        valueB: ''
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

  const savePair = (pair: AddedMeasurementTemplatePairs) => {
    const updatedPair = pair.pair;
    const oldPair = addedPairs.find((addedPair) => addedPair.index === pair.index);
    const oldPairs = addedPairs.filter((oldPair) => oldPair.index !== pair.index)
    setAddedPairs([...oldPairs, pair]);
    if (oldPair == undefined) return;
    const index = template.measurement_template_pairs.findIndex(newPair => newPair.key === oldPair.pair.key);
    if (index !== -1) {
      const updatedTemplate = { ...template };
      updatedTemplate.measurement_template_pairs[index] = updatedPair
      setTemplate(updatedTemplate);
    }
  };

  const onDeleteNewPair = (pairIndex: number) => {
    const pairToDelete = addedPairs.find((pair) => pair.index == pairIndex);
    if (pairToDelete === undefined) return;
    const newPairs = addedPairs.filter((pair) => pair.index !== pairIndex)
    setAddedPairs(newPairs);

    const newPairs2 = template.measurement_template_pairs.filter((pair) => pair.user_input).concat(newPairs.map((newPair) => newPair.pair));
    const updatedTemplate = { ...template, ...{measurement_template_pairs: newPairs2} };
    console.log(updatedTemplate);
    setTemplate(updatedTemplate);
    return;
  }

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

  const listTemplatePairs = () => {
    return [
      ...addedPairs.sort((a, b) => a.index - b.index).map((pair) => (
        <TemplatePairCard {...{addedPair: pair, savePair: savePair, key: pair.index, onDelete: onDeleteNewPair}}></TemplatePairCard>
      ))
    ];
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
            <Box m={1} sx={{width: '600px', marginRight: '10px'}}>
              <MultiLineInput
                name="comment"
                label="Comment"
                value={template.comment}
                onChange={handleCommentChange}
              />
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
          <Box>
              <Box m={1}
                sx={{
                  fontWeight: 'bold'
                }}
              >
                Validation pairs
                <IconButton
                  aria-label="add"
                  onClick={onAddTemplateClick}
                >
                  <AddIcon />

                </IconButton>
              </Box>
            <ListItems
                loading={false}
                list={listTemplatePairs()}
                errorMessage={""}
                loadingMessage={`Fetching template...`}
                hasToolbar={false}
                maxHeight={null}
              />
            </Box>
        </Collapse>
      </Box>
    </CommonCard >
  )
}
