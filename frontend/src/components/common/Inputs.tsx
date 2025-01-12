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
  disabled?: boolean;
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
    helperText = 'Field can\'t be empty',
    disabled = false
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
      disabled={disabled}
    />
  )
}

export interface MultiLineInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export function MultiLineInput({name, label, value, onChange, disabled = false}: MultiLineInputProps) {
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
      disabled={disabled}
    />
  )
}