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
import { SidebarProvider } from '../contexts/SidebarContext';
import { fetchSeries } from '../utils/PACSFetchers';
import { withAuthentication } from '../utils/WithAuthentication';
import removeSeriesFromLocalStorage from '../utils/RemoveSeriesFromLocalStorage';
import removeStudiesFromLocalStorage from '../utils/RemoveStudiesFromLocalStorage';
import { saveSeriesData, saveStudyData } from '../utils/Savers';
import { getStudyData } from '../utils/DatabaseFetchers';
import { postValidationData } from '../utils/ValidationFetchers';
import { fetchProjectDefaultTemplates, fetchProjectTemplates, fetchProjects } from '../utils/MAFILFetchers';
import { FormattedTemplate, MissingSeries, PACSSeries, Project, StudyProps, ValidatedSeries } from '../../../shared/Types';
import ExpandButton from '../components/common/ExpandButton';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [expanded, setExpanded] = useState(false);


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

  async function fetchMafilData() {
    try {
      const fetchedProjects: Project[] = await fetchProjects(auth.user ? auth.user.access_token : '');
      const project = fetchedProjects.find((project) => project.acronym == props.ReferringPhysicianName);
      const fetchedTemplates: FormattedTemplate[] = await fetchProjectTemplates(project ? project.uuid : '', auth.user ? auth.user.access_token : '');
      const defaultTemplate = await fetchProjectDefaultTemplates(project ? project.uuid : '', auth.user ? auth.user.access_token : '');
      if (defaultTemplate !== undefined && selectedTemplateId == '') {
        setSelectedTemplateId(defaultTemplate.id);
      }
      setStudyTemplates(fetchedTemplates);
    } catch(err) {

    }

  }

  async function fetchData() {
    setFetchStatus('saving');
    const currentStudyString = localStorage.getItem('currentStudy');
    if (currentStudyString) {
      try {
        const currentStudy = JSON.parse(currentStudyString);
        console.log(currentStudy);
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
      fetchMafilData();
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
    fetchMafilData();
  }, []);

  function handleRefresh() {
    fetchData();
    fetchMafilData();
  };

  function toggleExpand() {
    setExpanded(!expanded);
  }

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

      const {validatedSeries, missingSeries} = await postValidationData(pacsSeries, choosenTemplate);
      console.log("validatedSeries");
      console.log(validatedSeries);
      setValidatedSeries(validatedSeries);
      setMissingSeries(missingSeries);
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
          allExpanded={expanded}
        />
      )),
      ...missingSeries.map((series) => (
        <Series
          key={`missing-${series.SeriesDescription}`}
          validatedSerie={null}
          missingSerie={series}
          onCopy={handleSeriesCopy}
          onPaste={handleSeriesPaste}
          allExpanded={expanded}
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
              <ExpandButton expanded={expanded} onClick={toggleExpand}></ExpandButton>
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
