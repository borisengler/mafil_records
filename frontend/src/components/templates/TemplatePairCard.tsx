import React, {useEffect, useState} from 'react';
import CommonCard from '../common/CommonCard';
import {MeasurementTemplatePair} from '../../../../shared/Types';
import Box from '@mui/material/Box';
import {FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, CardActions, IconButton} from '@mui/material';
import {AddedMeasurementTemplatePairs} from './TemplateItemCard';
import {DeleteDialog} from './DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import {SingleLineInput} from '../common/Inputs';


interface TemplatePairCardProps {
  addedPair: AddedMeasurementTemplatePairs,
  savePair: (pair: AddedMeasurementTemplatePairs) => void,
  onDelete: (index: number) => void
}

export default function TemplatePairCard(props: TemplatePairCardProps) {

  const [pair, setPair] = useState<MeasurementTemplatePair>(props.addedPair.pair);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(-1);


  useEffect(() => {
    props.savePair({pair: pair, index: props.addedPair.index})
  }, [pair]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setPair({...pair, [name]: value});
  }

  const handleTypeOfComparisonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const comparison = (event.target.value == 'equal') ? 'equal' : 'range';
    setPair({...pair, type_of_comparison: comparison});
  };

  const onDeleteClick = (index: number) => {
    setItemToDelete(index)
    setIsDeleteDialogOpen(true);
  }

  const deleteItem = () => {
    props.onDelete(itemToDelete);
    setIsDeleteDialogOpen(false);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
    setItemToDelete(-1);
  }

  const valueAerror = pair.type_of_comparison == 'equal' ? (pair.valueA == '') : (pair.valueA == '' && pair.valueB == '');
  const valueBerror = pair.type_of_comparison == 'equal' ? false : (pair.valueA == '' && pair.valueB == '');
  const valueAHint = pair.type_of_comparison == 'equal' ? 'Field can\'t be empty' : 'At least one of the values must be filled';
  const valueBHint = pair.type_of_comparison == 'equal' ? 'Field can\'t be empty' : 'At least one of the values must be filled';

  const keyError = (pair.key == undefined || pair.key == '') && pair.key == '';
  const keyHint = 'Field can\'t be empty';

  return (

    <CommonCard>

      <Box display={'flex'} flexDirection={'row'}>
        <DeleteDialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} onConfirm={deleteItem}></DeleteDialog>
        <Box m={1} flexGrow={1}>
          <SingleLineInput label='Source (PACS key)' name='key'
                                 value={pair.key ? pair.key : ''} onChange={handleTextChange}
                                 error={keyError} helperText={keyHint}/>
        </Box>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Type of Comparison</FormLabel>
          <RadioGroup
            aria-label='comparison-type'
            name='comparison-type'
            value={pair.type_of_comparison}
            onChange={handleTypeOfComparisonChange}
            row
          >
            <FormControlLabel value='equal' control={<Radio/>} label='Equal'/>
            <FormControlLabel value='range' control={<Radio/>} label='Range'/>
          </RadioGroup>
        </FormControl>
        <Box m={1} flexGrow={1}>

          <SingleLineInput label={pair.type_of_comparison == 'equal' ? 'Value' : 'From'} name='valueA'
                           value={pair.valueA ? pair.valueA : ''} onChange={handleTextChange}
                           error={valueAerror} helperText={valueAHint}/>
        </Box>
        <Box m={1} flexGrow={1}>

          <SingleLineInput label={pair.type_of_comparison == 'equal' ? 'Value (unused)' : 'To'} name='valueB'
                           value={pair.valueB ? pair.valueB : ''} onChange={handleTextChange}
                           error={valueBerror} helperText={valueBHint}/>
        </Box>

        <CardActions disableSpacing>
          <span>
            <IconButton
              aria-label='delete'
              onClick={() => onDeleteClick(props.addedPair.index)}
            >
                <DeleteIcon/>
            </IconButton>
          </span>
        </CardActions>
      </Box>
    </CommonCard>
  )
}