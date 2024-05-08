import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IconButton, Tooltip} from '@mui/material';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, {useEffect, useState} from 'react';
import CommonCard, {ExpandMore} from '../common/CommonCard';
import {MultiLineInput} from '../common/Inputs';
import {MeasurementTemplate, MeasurementTemplatePair} from "../../../../shared/Types";
import {SeriesSingleLineInput} from '../series/Series';
import DeleteIcon from '@mui/icons-material/Delete';
import {DeleteDialog} from './DeleteDialog';
import AddIcon from '@mui/icons-material/Add';
import TemplatePairCard from './TemplatePairCard';
import ListItems from '../common/ListItems';
import SaveIcon from '@mui/icons-material/Save';

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

  function CheckboxInput({text, checked, name}: CheckboxInputProps) {
    return (
      <Box>
        <FormControlLabel control={
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            name={name}
            color="primary"
          />
        } label={text}/>
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
    var index = 0;
    props.template.measurement_template_pairs.filter((pair) => !pair.user_input).forEach(pair => {
      pairs = [...pairs, {index: index, pair: pair}]
      index++;
    });
    setAddedPairsIndex(index);

    return pairs;
  });

  const [order, setOrder] = useState(props.template.order_for_displaying ? props.template.order_for_displaying.toString() : '');

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
      key_source: "",
      user_input: false,
      type_of_comparison: "equal",
      valueA: '',
      valueB: ''
    }
    setAddedPairs([...addedPairs, {index: addedPairsIndex, pair: new_pair}]);
    setAddedPairsIndex(addedPairsIndex + 1);
    setTemplate({...template, measurement_template_pairs: [...template.measurement_template_pairs, new_pair]});
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name} = event.target;
    const index = template.measurement_template_pairs.findIndex(pair => pair.key === name);
    if (index === -1) {
      const new_pair: MeasurementTemplatePair = {
        key: name,
        user_input: true,
        type_of_comparison: "equal",
        valueA: event.target.checked.toString(),
        valueB: ''
      }
      setTemplate(prevTemplate => ({
        ...prevTemplate,
        measurement_template_pairs: [...prevTemplate.measurement_template_pairs, new_pair]
      }))
    } else {
      const updatedTemplate = {...template};
      updatedTemplate.measurement_template_pairs[index] = {
        ...updatedTemplate.measurement_template_pairs[index],
        valueA: event.target.checked.toString(),
      }
      setTemplate(updatedTemplate);
    }
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setTemplate({...template, comment: value});
  }

  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setOrder(value);

  }

  const handleConfirmOrder = () => {
    if (order == "") {
      setTemplate({...template, order_for_displaying: null});
    } else {
      const new_order = parseInt(order)
      setTemplate({...template, order_for_displaying: new_order});
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    const index = template.measurement_template_pairs.findIndex(pair => pair.key === name);
    if (index === -1) {
      const new_pair: MeasurementTemplatePair = {
        key: name,
        user_input: true,
        type_of_comparison: "equal",
        valueA: value,
        valueB: ''
      }
      setTemplate(prevTemplate => ({
        ...prevTemplate,
        measurement_template_pairs: [...prevTemplate.measurement_template_pairs, new_pair]
      }))
    } else {
      const updatedTemplate = {...template};
      updatedTemplate.measurement_template_pairs[index] = {
        ...updatedTemplate.measurement_template_pairs[index],
        valueA: value,
      }
      setTemplate(updatedTemplate);
    }
  };

  const savePair = (pair: AddedMeasurementTemplatePairs) => {
    const oldPair = addedPairs.find((addedPair) => addedPair.index === pair.index);
    const oldPairs = addedPairs.filter((oldPair) => oldPair.index !== pair.index)
    setAddedPairs([...oldPairs, pair]);
    if (oldPair == undefined) return;
    const index = template.measurement_template_pairs.findIndex(newPair => newPair.key === oldPair.pair.key);
    if (index !== -1) {
      const userInputPairs = template.measurement_template_pairs.filter((pair) => pair.user_input);
      const validationPairs = [...oldPairs, pair].map((pair) => pair.pair);
      // todo je to nejake spomalene
      setTemplate({...template, measurement_template_pairs: [...userInputPairs, ...validationPairs]});
    }
  };


  const onDeleteNewPair = (pairIndex: number) => {
    const pairToDelete = addedPairs.find((pair) => pair.index == pairIndex);
    if (pairToDelete === undefined) return;
    const newPairs = addedPairs.filter((pair) => pair.index !== pairIndex)
    setAddedPairs(newPairs);

    const newPairs2 = template.measurement_template_pairs.filter((pair) => pair.user_input).concat(newPairs.map((newPair) => newPair.pair));
    const updatedTemplate = {...template, ...{measurement_template_pairs: newPairs2}};
    (updatedTemplate);
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

  function getStringValue(value: string, isNumeric: boolean = false) {
    const pair = template.measurement_template_pairs.find(pair => pair.key === value);
    if (pair === undefined) {
      return isNumeric ? "0" : "";
    }
    return pair.valueA ? pair.valueA : (isNumeric ? "0" : "");
  }

  const listTemplatePairs = () => {
    return [
      ...addedPairs.sort((a, b) => a.index - b.index).map((pair) => (
        <TemplatePairCard {...{
          addedPair: pair,
          savePair: savePair,
          key: pair.index,
          onDelete: onDeleteNewPair
        }}></TemplatePairCard>
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
              <DeleteIcon/>
            </IconButton>
              <ExpandMore
                expand={isExpanded}
                onClick={handleSeriesClick}
                aria-expanded={isExpanded}
              >
                <ExpandMoreIcon/>
              </ExpandMore>
            </span>
          </CardActions>

        </Box>

        <DeleteDialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} onConfirm={deleteItem}></DeleteDialog>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
            <SeriesSingleLineInput label='Stim. protocol' name='stim_protocol' value={getStringValue("stim_protocol")}
                                   onChange={handleTextChange}/>
            <SeriesSingleLineInput label='Stim. log file' name='stim_log_file' value={getStringValue("stim_log_file")}
                                   onChange={handleTextChange}/>
            <SeriesSingleLineInput label='Fyzio raw file (for BP)' name='fyzio_raw_file'
                                   value={getStringValue("fyzio_raw_file")} onChange={handleTextChange}/>
            <Box sx={{width: '200px'}} display={'flex'} alignItems={'center'}>
              <SeriesSingleLineInput
                name="order_for_displaying"
                type="number"
                label="Order"
                value={order}
                onChange={handleOrderChange}
              />
              <Tooltip title="Save order (this action may move this item)">
                <IconButton onClick={handleConfirmOrder}>
                  <SaveIcon/>
                </IconButton>
              </Tooltip>
            </Box>
            <Box m={1} sx={{width: '60ch', marginRight: '10px'}}>
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
                <CheckboxInput text='EEG' checked={isChecked("general_eeg")} name="general_eeg"/>
                <CheckboxInput text='ET' checked={isChecked("general_et")} name="general_et"/>
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
                <CheckboxInput text='EKG' checked={isChecked("bp_ekg")} name="bp_ekg"/>
                <CheckboxInput text='Resp.' checked={isChecked("bp_resp")} name="bp_resp"/>
                <CheckboxInput text='GSR' checked={isChecked("bp_gsr")} name="bp_gsr"/>
                <CheckboxInput text='ACC' checked={isChecked("bp_acc")} name="bp_acc"/>
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
                <CheckboxInput text='EKG' checked={isChecked("siemens_ekg")} name="siemens_ekg"/>
                <CheckboxInput text='Resp.' checked={isChecked("siemens_resp")} name="siemens_resp"/>
                <CheckboxInput text='PT' checked={isChecked("siemens_pt")} name="siemens_pt"/>
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
                <AddIcon/>

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
    </CommonCard>
  )
}
