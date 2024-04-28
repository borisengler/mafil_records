import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from 'react';


interface AddMeasurementTemplateDialogProps {
    open: boolean,
    onClose: () => void,
    onConfirm: (name: string) => void
}

export default function AddMeasurementTemplateDialog(props: AddMeasurementTemplateDialogProps) {

    const [name, setName] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add new measurement template"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Add new measurement template. Fill the name.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={handleNameChange}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {props.onConfirm(name)}} color="primary" disabled={name == ''}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
}