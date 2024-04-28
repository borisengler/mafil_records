import React, { useState } from 'react';
import CommonCard, { ExpandMore } from '../common/CommonCard';
import { FormattedTemplate, Project } from '../../../../shared/Types';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardActions, IconButton } from '@mui/material';
import { DeleteDialog } from './DeleteDialog';
import EditIcon from '@mui/icons-material/Edit';

interface TemplateCardProps {
    template: FormattedTemplate;
    onDelete: (template: FormattedTemplate) => void;
  }

export default function TemplateCard (props: TemplateCardProps) {
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FormattedTemplate | undefined>(undefined);

  const handleClick = () => {
    localStorage.setItem('currentTemplate', JSON.stringify(props.template));
    navigate('/template-edit');
  };

  const onDeleteClick = (template: FormattedTemplate) => {
    setItemToDelete(template)
    setIsDeleteDialogOpen(true);
  }

  const deleteItem = () => {
    if (itemToDelete !== undefined) {
      props.onDelete(itemToDelete);
    }
    setIsDeleteDialogOpen(false);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
    setItemToDelete(undefined);
  }


  return (
    <>
      <DeleteDialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} onConfirm={deleteItem}></DeleteDialog>
      <CommonCard>
          <Box>{`${props.template.name} (v${props.template.version})`}</Box>
          <CardActions disableSpacing>
              <IconButton
                aria-label="edit"
                onClick={handleClick}>
                <EditIcon />

              </IconButton>
              <IconButton
                  aria-label="delete"
                  onClick={() => onDeleteClick(props.template)}
                  >
                  <DeleteIcon />
              </IconButton>
          </CardActions>
      </CommonCard>
    </>
  )
}