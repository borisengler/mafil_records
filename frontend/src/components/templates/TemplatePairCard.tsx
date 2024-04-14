

import React, { useEffect, useState } from 'react';
import CommonCard, { ExpandMore } from '../common/CommonCard';
import { FormattedTemplate, MeasurementTemplatePair } from '../../../../shared/Types';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { SeriesSingleLineInput } from '../series/Series';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { AddedMeasurementTemplatePairs } from './TemplateItemCard';


interface TemplatePairCardProps {
    addedPair: AddedMeasurementTemplatePairs,
    savePair: (pair: AddedMeasurementTemplatePairs) => void
  }

export default function TemplatePairCard (props: TemplatePairCardProps) {

    const [pair, setPair] = useState<MeasurementTemplatePair>(props.addedPair.pair);

    useEffect(() => {
        props.savePair({pair: pair, index: props.addedPair.index})
      }, [pair]);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPair({...pair, [name]: value});
    }

    const handleTypeOfComparisonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const comparison = (event.target.value == "equal") ? "equal" : "range";
        setPair({...pair, type_of_comparison: comparison});
      };

    return (

        <CommonCard>

            <Box display={'flex'} flexDirection={'row'}>
                <SeriesSingleLineInput label='Source (PACS key)' name='key_source' value={pair.key_source ? pair.key_source : ""} onChange={handleTextChange} />
                <SeriesSingleLineInput label='Key (Mafil key)' name='key' value={pair.key} onChange={handleTextChange} />
                
                <FormControl component="fieldset">
                <FormLabel component="legend">Type of Comparison</FormLabel>
                <RadioGroup
                    aria-label="comparison-type"
                    name="comparison-type"
                    value={pair.type_of_comparison}
                    onChange={handleTypeOfComparisonChange}
                    row
                >
                    <FormControlLabel value="equal" control={<Radio />} label="Equal" />
                    <FormControlLabel value="range" control={<Radio />} label="Range" />
                </RadioGroup>
                </FormControl>
                
                <SeriesSingleLineInput label={pair.type_of_comparison == "equal" ? "Value" : "From"} name='valueA' value={pair.valueA ? pair.valueA : ""} onChange={handleTextChange} />
                <SeriesSingleLineInput label='To (range)' name='valueB' value={pair.valueB ? pair.valueB : ""} onChange={handleTextChange} />
                
            </Box>
        </CommonCard>
    )
}