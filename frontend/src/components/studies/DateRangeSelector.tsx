import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers';
import React, {useContext, useEffect, useState} from 'react';
import SidebarContext from "../../contexts/SidebarContext";
import {BlueButton} from "../common/Buttons";

export function formatDateToISOString(date: Date | null): string {
  if (!date || isNaN(date.getTime())) {
    return '';
  }

  const dateString = date.toISOString();
  const hasMilliseconds = /\.\d{3}Z$/;

  if (hasMilliseconds.test(dateString)) {
    return dateString.slice(0, -5); // Remove the milliseconds and 'Z' at the end
  }

  return dateString;
}

type DateRange = {
  start: string;
  end: string;
};

type DateRangeChoice = 'hardcoded' | 'past72Hours' | 'custom';

interface DateRangeSelectorProps {
  setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
  dateRange: { start: string; end: string };
  fetchData: () => void;
}

export function DateRangeSelector({setDateRange, dateRange, fetchData}: DateRangeSelectorProps) {
  const [currentChoice, setCurrentChoice] = useState<DateRangeChoice>('past72Hours');
  const {sidebarWidth} = useContext(SidebarContext);

  // Get past 72 hours on refresh
  useEffect(() => {
    setCurrentChoice('past72Hours');
    setDateRangeChoice(currentChoice);
  }, []); // The empty array as a dependency ensures this only runs once when the component mounts

  function setDateRangeChoice(choice: DateRangeChoice) {
    setCurrentChoice(choice);
    if (choice === 'past72Hours') {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setHours(endDate.getHours() - 72);
      handleCustomDateChange(formatDateToISOString(startDate), formatDateToISOString(endDate));
      fetchData();
    }
  }

  const handleCustomDateChange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    if (!(isNaN(startDate.getTime()) || isNaN(endDate.getTime()))) {
      setDateRange({start: formatDateToISOString(startDate), end: formatDateToISOString(endDate)});
    }
  };

  const handleFetchButtonClick = () => {
    fetchData();
  };

  return (
    <React.Fragment>
      <Box
        gap={2}
        display='flex'
        flexWrap='wrap'
        flexDirection='row'
      >
        <Box>
          <FormControl>
            <InputLabel>Date Range</InputLabel>
            <Select
              label={'Date Range'}
              value={currentChoice}
              onChange={(e: SelectChangeEvent<DateRangeChoice>) =>
                setDateRangeChoice(e.target.value as DateRangeChoice)
              }
              style={{
                maxWidth: `${sidebarWidth - 40}px`,
              }}
            >
              <MenuItem value={'past72Hours'}>Past 72 Hours</MenuItem>
              <MenuItem value={'custom'}>Custom</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {currentChoice === 'custom' && (
          <React.Fragment>
            <Box>
              <DatePicker
                label="Start Date"
                value={new Date(dateRange.start)}
                onChange={(newValue: Date | null) => {
                  handleCustomDateChange(formatDateToISOString(newValue), dateRange.end);
                }}
              />
            </Box>
            <Box>
              <DatePicker
                label="End Date"
                value={new Date(dateRange.end)}
                onChange={(newValue: Date | null) => {
                  handleCustomDateChange(dateRange.start, formatDateToISOString(newValue));
                }}
              />
            </Box>
          </React.Fragment>
        )}
      </Box>
      <BlueButton onClick={handleFetchButtonClick} text="Fetch studies"/>
    </React.Fragment>
  );
}

export default DateRange;
