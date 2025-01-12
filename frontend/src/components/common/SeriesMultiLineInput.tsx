import React from "react";
import { Box } from "@mui/material";
import { MultiLineInputProps, MultiLineInput } from "./Inputs";

export function SeriesMultiLineInput({name, label, value, onChange, disabled = false}: MultiLineInputProps) {
  return (
    <Box m={1} flexGrow={1}>
      <MultiLineInput
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </Box>
  )
}