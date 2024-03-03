import React, { useState } from 'react';
import { IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, FormControl, InputLabel } from '@mui/material';
import { Template } from "../../shared/Types";


interface TemplateDropdownProps {
  selectedTemplate: string | null;
  handleTemplateChange: (template: string | null) => void;
  templates: Template[];
}

export const TemplateDropdown: React.FC<TemplateDropdownProps> = ({ selectedTemplate, handleTemplateChange, templates }) => {
  const [template, setTemplate] = useState<string | null>(selectedTemplate);

  const onTemplateChange = (event: SelectChangeEvent<string | null>) => {
    const selectedValue = event.target.value;
    setTemplate(selectedValue);
    handleTemplateChange(selectedValue);
  };

  const isTemplateSelected = (uuid: string | null) => {
    if (uuid != null && template != null) {
      return uuid == template;
    }
    return true;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="template-dropdown-label">Select Template</InputLabel>
      <Select
        labelId="template-dropdown-label"
        id="template-dropdown"
        value={template}
        onChange={onTemplateChange}
        label="Select Template"
      >
        <MenuItem value="">No template</MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.uuid} value={template.uuid} selected={isTemplateSelected(template.uuid)}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
