import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import ListItems from '../components/common/ListItems';
import CommonAppBar from '../components/global/AppBarContent';
import { ResizableSidebar } from '../components/global/ResizableSidebar';
import { DateRangeSelector, formatDateToISOString } from '../components/studies/DateRangeSelector';
import { Study, StudyProps } from '../components/studies/Study';
import { SidebarProvider } from '../contexts/SidebarContext';
import { fetchStudies } from '../utils/PACSFetchers';
import LoginButton from '../components/common/LoginButton';
import RefreshButton from '../components/common/RefreshButton';
import { withAuthentication } from '../utils/WithAuthentication';
import { BlueButton } from '../components/common/Buttons';
import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


function Studies() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'saving' | 'success' | 'failed'>('idle');
  const [studiesJson, setStudiesJson] = useState<StudyProps[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setHours(endDate.getHours() - 72);
  const [dateRange, setDateRange] = useState({
    start: formatDateToISOString(startDate),
    end: formatDateToISOString(endDate),
  });

  useEffect(() => {console.log(dateRange)}, [dateRange])

  async function fetchData() {
    setLoading(true);
    setFetchStatus('saving');
    try {
      const json = await fetchStudies(dateRange);
      // Sort the studies by date, newest first
      json.sort((a: { StudyDate: Date; }, b: { StudyDate: Date; }) => new Date(b.StudyDate).getTime() - new Date(a.StudyDate).getTime());
      setStudiesJson(json);
      setFetchError(null);
      setFetchStatus('success');
    } catch (error) {
      setFetchStatus('failed');
      setFetchError('Fetching studies failed, check internet connection and make sure you are connected through MUNI VPN. Then try again. It is also possible the date range is too wide to fetch in a reasonable amount of time. If problem persists, contact your system administrator.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleRefresh() {
    fetchData();
  };

  const studies = studiesJson.map((study) => (
    <Study
      key={study.StudyInstanceUID}
      StudyInstanceUID={study.StudyInstanceUID}
      AccessionNumber={study.AccessionNumber}
      InstitutionName={study.InstitutionName}
      NumberOfStudyRelatedSeries={study.NumberOfStudyRelatedSeries}
      PatientBirthDate={study.PatientBirthDate}
      PatientID={study.PatientID}
      PatientName={study.PatientName}
      PatientSex={study.PatientSex}
      ReferringPhysicianName={study.ReferringPhysicianName}
      StudyDate={study.StudyDate}
      StudyTime={study.StudyTime}
      StudyDescription={study.StudyDescription}
      StudyID={study.StudyID}
    />
  ));

  const lastAccessedStudyJSON = localStorage.getItem('currentStudy');
  const lastAccessedStudy = lastAccessedStudyJSON ? JSON.parse(lastAccessedStudyJSON) : undefined; 

  return (
    <SidebarProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <React.Fragment>
          <CommonAppBar
            open={open}
            toggleDrawer={toggleDrawer}
            pageTitle='Choosing a study'
            content={
              <RefreshButton fetchStatus={fetchStatus} onClick={handleRefresh} tooltipTitle='Fetch studies for the chosen timeframe' />
            }
          />
          <ResizableSidebar
            open={open}
            toggleDrawer={toggleDrawer}
          >
            <LoginButton />
            <DateRangeSelector
              dateRange={dateRange}
              setDateRange={setDateRange}
              fetchData={fetchData}
            />
            {lastAccessedStudy !== undefined && 
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BlueButton text="Open last accessed study" path="/measuring" />
              <div style={{ marginLeft: '4px' }}> 
                <Tooltip title={
                  <span>
                    Project <strong>{lastAccessedStudy.ReferringPhysicianName}</strong>
                    <br/>
                    VisitId <strong>{lastAccessedStudy.AccessionNumber}</strong>
                    <br/>
                    StudyId <strong>{lastAccessedStudy.StudyInstanceUID}</strong>
                    <br/>
                    Patient <strong>{lastAccessedStudy.PatientName}</strong>
                  </span>}
                  >
                  <InfoOutlinedIcon />
                </Tooltip>
              </div>
            </div>

            }
            {<BlueButton text="Template administration" path="/templates" />}
          </ResizableSidebar>
          <ListItems
            loading={loading}
            list={studies}
            errorMessage={fetchError}
            loadingMessage={'Fetching studies...'}
          />
        </React.Fragment>
      </LocalizationProvider>
    </SidebarProvider>
  );
}

const ProtectedStudies = withAuthentication(Studies);
export default ProtectedStudies;
