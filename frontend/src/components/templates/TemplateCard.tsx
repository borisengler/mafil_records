import React, {useState} from 'react';
import CommonCard from '../common/CommonCard';
import {FormattedTemplate} from '../../../../shared/Types';
import Box from '@mui/material/Box';
import {useNavigate} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import {CardActions, IconButton} from '@mui/material';
import {DeleteDialog} from './DeleteDialog';
import EditIcon from '@mui/icons-material/Edit';

interface TemplateCardProps {
  template: FormattedTemplate;
  onDelete: (template: FormattedTemplate) => void;
}

export default function TemplateCard(props: TemplateCardProps) {
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

        <Box>
          <Box m={1} mb={0} display={'flex'} justifyContent={'space-between'} flexDirection={'row'} flexWrap={'wrap'}>

            <Box
              fontWeight={'bold'}
              fontSize={18}
              whiteSpace={'break-spaces'}
            >
              {`${props.template.name} (v${props.template.version})`}
            </Box>
            <CardActions disableSpacing>
              <span>
                <IconButton
                  aria-label='edit'
                  onClick={handleClick}>
                  <EditIcon/>

                </IconButton>
                <IconButton
                  aria-label='delete'
                  onClick={() => onDeleteClick(props.template)}
                >
                  <DeleteIcon/>
                </IconButton>
              </span>
            </CardActions>
          </Box>
        </Box>
      </CommonCard>
    </>
  )
}