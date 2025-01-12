import React from "react";
import { Box } from "@mui/material";
import { SingleLineInputProps, SingleLineInput } from "./Inputs";

export function SeriesSingleLineInput({name, label, value, onChange, type = 'text', disabled = false}: SingleLineInputProps) {
    return (
      <Box m={1} flexGrow={1}>
        <SingleLineInput
          name={name}
          label={label}
          value={value}
          type={type}
          onChange={onChange}
          disabled={disabled}
        />
      </Box>
    );
  }