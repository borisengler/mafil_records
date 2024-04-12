import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import RefreshButton from '../components/common/RefreshButton';
import { BlueButton, RedButton } from '../components/common/Buttons';
import InfoItem from '../components/common/InfoItem';
import { MultiLineInput } from '../components/common/Inputs';
import ListItems from '../components/common/ListItems';
import SaveButton from '../components/common/SaveButton';
import SortButton from '../components/common/SortButton';
import CommonAppBar from '../components/global/AppBarContent';
import { ResizableSidebar } from '../components/global/ResizableSidebar';
import { Series } from '../components/series/Series';
import { TemplateDropdown } from '../components/series/TemplateDropdown';
import { StudyProps } from '../components/studies/Study';
import { SidebarProvider } from '../contexts/SidebarContext';
import { fetchSeries } from '../utils/PACSFetchers';
import { withAuthentication } from '../utils/WithAuthentication';
import removeSeriesFromLocalStorage from '../utils/RemoveSeriesFromLocalStorage';
import removeStudiesFromLocalStorage from '../utils/RemoveStudiesFromLocalStorage';
import { saveSeriesData, saveStudyData } from '../utils/Savers';
import { getStudyData } from '../utils/DatabaseFetchers';
import { postValidationData } from '../utils/ValidationFetchers';
import { fetchStudyDefaultTemplates, fetchStudyTemplates } from '../utils/MAFILFetchers';
import { FormattedTemplate, MissingSeries, PACSSeries, ValidatedSeries } from '../../../shared/Types';

export interface StudyData {
  study_instance_uid: string;
  general_comment: string;
}

function Measuring() {
  const auth = useAuth();
  const [open, setOpen] = React.useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pacsSeries, setPacsSeries] = useState<PACSSeries[]>([]);
  const [validatedSeries, setValidatedSeries] = useState<ValidatedSeries[]>([]);
  const [missingSeries, setMissingSeries] = useState<MissingSeries[]>([]);
  const [selectedSeqId, setSelectedSeqId] = React.useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'failed'>('idle');
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'saving' | 'success' | 'failed'>('idle');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [props, setProps] = useState<StudyProps>(() => {
    const localStudy = localStorage.getItem(`currentStudy`);
    return localStudy ? JSON.parse(localStudy) : {};
  });

  const [studyData, setStudyData] = useState<StudyData>({
    study_instance_uid: props.StudyInstanceUID,
    general_comment: '',
  });


  const [studyTemplates, setStudyTemplates] = useState<FormattedTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  async function saveRecords(): Promise<boolean> {
    setSaveStatus('saving');
    const seriesSuccess = await saveSeriesData(props.StudyInstanceUID);
    const studySuccess = await saveStudyData(props.StudyInstanceUID);

    if (seriesSuccess && studySuccess) {
      setSaveStatus('success');
      return true;
    }

    setSaveStatus('failed');
    return false;
  }

  async function fetchData() {
    setFetchStatus('saving');
    const currentStudyString = localStorage.getItem('currentStudy');
    if (currentStudyString) {
      try {
        const fetchedTemplates: FormattedTemplate[] = await fetchStudyTemplates(props.StudyID);
        const defaultTemplate = await fetchStudyDefaultTemplates(props.StudyID);
        if (defaultTemplate !== undefined && selectedTemplateId == '') {
          setSelectedTemplateId(defaultTemplate.id);
        }
        setStudyTemplates(fetchedTemplates);

        const currentStudy = JSON.parse(currentStudyString);
        const json = await fetchSeries(currentStudy.AccessionNumber);
        // Sort the series by series number, highest (newly added) first
        json.sort((a: PACSSeries, b: PACSSeries) => a.SeriesNumber - b.SeriesNumber);
        setFetchError(null);
        setFetchStatus('success');
        setPacsSeries(json);
      } catch (error) {
        setFetchStatus('failed');
        setFetchError('Fetching series failed, check internet connection and try again. If problem persists, contact your system administrator.');
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    // Every 30 seconds, fetch series from PACS-API
    const interval = setInterval(() => {
      fetchData();
    }, 30 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedTemplateId]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  function toggleSortOrder() {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedData = [...pacsSeries];
    if (newSortOrder === 'asc') {
      sortedData.sort((a: PACSSeries, b: PACSSeries) => a.SeriesNumber - b.SeriesNumber);
    } else {
      sortedData.sort((a: PACSSeries, b: PACSSeries) => b.SeriesNumber - a.SeriesNumber);
    }
    setPacsSeries(sortedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleRefresh() {
    fetchData();
  };

  async function handleFinishStudy() {
    const saveSuccess = await saveRecords();
    if (saveSuccess) {
      removeSeriesFromLocalStorage();
      removeStudiesFromLocalStorage();
    }
  }

  async function handleBackToStudies() {
    const saveSuccess = await saveRecords();
    if (saveSuccess) {
      removeSeriesFromLocalStorage();
      removeStudiesFromLocalStorage();
    }
  }

  const handleSeriesCopy = (seqId: string) => {
    setSelectedSeqId(seqId);
  };

  const handleSeriesPaste = () => {
    return selectedSeqId;
  };

 useEffect(() => {
    (async () => {
      const fetchedStudyData = await getStudyData(props.StudyInstanceUID);
      setStudyData(fetchedStudyData);
    })();
  }, [props.StudyInstanceUID]);

  useEffect(() => {
    (async () => {
      const choosenTemplate = studyTemplates.find((template) => template.id === selectedTemplateId);

      if (choosenTemplate != null) {
        const {validatedSeries, missingSeries} = await postValidationData(pacsSeries, choosenTemplate);
        setValidatedSeries(validatedSeries);
        setMissingSeries(missingSeries);
      }
    })()
  
  }, [studyTemplates, selectedTemplateId, pacsSeries]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setStudyData({
      ...studyData,
      [name]: value,
    });
  };

  useEffect(() => {
    localStorage.setItem(`study-${props.StudyInstanceUID}`, JSON.stringify({ ...studyData }))
  }, [studyData]);

  function listSeries() {
    return [
      ...validatedSeries.map((series) => (
        <Series
          key={`validated-${series.SeriesInstanceUID}`}
          validatedSerie={series}
          missingSerie={null}
          onCopy={handleSeriesCopy}
          onPaste={handleSeriesPaste}
        />
      )),
      ...missingSeries.map((series) => (
        <Series
          key={`missing-${series.SeriesDescription}`}
          validatedSerie={null}
          missingSerie={series}
          onCopy={handleSeriesCopy}
          onPaste={handleSeriesPaste}
        />
      )),
    ];
  }

  return (
    <SidebarProvider>
      <React.Fragment>
        <CommonAppBar
          open={open}
          toggleDrawer={toggleDrawer}
          pageTitle='Measuring and taking notes'
          content={
            <React.Fragment>
              <SortButton sortOrder={sortOrder} onClick={toggleSortOrder} />
              <SaveButton saveStatus={saveStatus} onClick={saveRecords} />
              <RefreshButton fetchStatus={fetchStatus} onClick={handleRefresh} tooltipTitle='Re-fetch series for current study' />
            </React.Fragment>
          }
        />
        <ResizableSidebar
          open={open}
          toggleDrawer={toggleDrawer}
        >
          <InfoItem label="Measuring operator" text={auth.user ? auth.user.profile.name : ''} />
          <InfoItem label="Visit ID" text={props.AccessionNumber} />
          <InfoItem label="Study UID" text={props.StudyInstanceUID} />
          <InfoItem label="Patient name" text={props.PatientName} />
          <TemplateDropdown
            selectedTemplate={selectedTemplateId}
            handleTemplateChange={setSelectedTemplateId}
            templates={studyTemplates}
          />
          <MultiLineInput
            label="General comment to study"
            name="general_comment"
            value={studyData.general_comment}
            onChange={handleTextChange}
          />
          <Box gap={2} display='flex' flexDirection="row" flexWrap='wrap' justifyContent="space-between">
            <BlueButton text="Finish study" path="/success" onClick={handleFinishStudy} />
            <RedButton text="Back to studies" path="/studies" onClick={handleBackToStudies} />
          </Box>
          <Divider sx={{ my: 3 }} />
        </ResizableSidebar>
          <ListItems
            loading={loading}
            list={listSeries()}
            errorMessage={fetchError}
            loadingMessage={`Fetching series...`}
          />
      </React.Fragment>
    </SidebarProvider >
  );
}

const ProtectedMeasuring = withAuthentication(Measuring);
export default ProtectedMeasuring;
