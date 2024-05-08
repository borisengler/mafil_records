import React, {useState} from 'react';
import {IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, FormControl, InputLabel} from '@mui/material';
import {FormattedTemplate} from "../../../../shared/Types";


interface TemplateDropdownProps {
  selectedTemplate: string;
  handleTemplateChange: (template: string) => void;
  templates: FormattedTemplate[];
}

export const TemplateDropdown: React.FC<TemplateDropdownProps> = ({
                                                                    selectedTemplate,
                                                                    handleTemplateChange,
                                                                    templates
                                                                  }) => {

  const onTemplateChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    handleTemplateChange(selectedValue);
  };

  const isTemplateSelected = (id: string) => {
    return id == selectedTemplate;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="template-dropdown-label">Select Template</InputLabel>
      <Select
        labelId="template-dropdown-label"
        id="template-dropdown"
        value={selectedTemplate || ''}
        onChange={onTemplateChange}
        label="Select Template"
      >
        <MenuItem value="">No template</MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.id} value={template.id} selected={isTemplateSelected(template.id)}>
            {`${template.name} (${template.version})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
