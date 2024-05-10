import TextField from '@mui/material/TextField';
import React from 'react';

export interface SingleLineInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export function SingleLineInput(
  {
    name,
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    error = required && value == '',
    helperText = 'Field can\'t be empty'
  }: SingleLineInputProps) {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <TextField
      key={`${name}-key`}
      label={label}
      name={name}
      value={value}
      onChange={handleTextChange}
      fullWidth
      variant='outlined'
      type={type}
      required={required}
      error={error}
      helperText={error && helperText}
    />
  )
}

export interface MultiLineInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function MultiLineInput({name, label, value, onChange}: MultiLineInputProps) {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <TextField
      key={`${name}-key`}
      label={label}
      name={name}
      value={value}
      onChange={handleTextChange}
      fullWidth
      multiline
      variant='outlined'
      maxRows={5}
    />
  )
}