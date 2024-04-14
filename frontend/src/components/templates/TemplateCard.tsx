import React from 'react';
import CommonCard, { ExpandMore } from '../common/CommonCard';
import { FormattedTemplate } from '../../../../shared/Types';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';


interface TemplateCardProps {
    template: FormattedTemplate
  }

export default function TemplateCard (props: TemplateCardProps) {
    const handleClick = () => {
        localStorage.setItem('currentTemplate', JSON.stringify(props.template));
      };

    return (
    <Link to='/template-edit' style={{ textDecoration: 'none' }} onClick={handleClick}>

        <CommonCard>
            <Box>{props.template.name}</Box>
        </CommonCard>
    </Link>
    )
}