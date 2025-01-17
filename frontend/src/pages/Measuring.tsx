import {Box, Divider} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAuth} from 'react-oidc-context';
import RefreshButton from '../components/common/RefreshButton';
import {BlueButton, RedButton} from '../components/common/Buttons';
import InfoItem from '../components/common/InfoItem';
import {MultiLineInput} from '../components/common/Inputs';
import ListItems from '../components/common/ListItems';
import SaveButton from '../components/common/SaveButton';
import SortButton from '../components/common/SortButton';
import CommonAppBar from '../components/global/AppBarContent';
import {ResizableSidebar} from '../components/global/ResizableSidebar';
import {Series} from '../components/series/Series';
import {TemplateDropdown} from '../components/series/TemplateDropdown';
import {SidebarProvider} from '../contexts/SidebarContext';
import {fetchSeries} from '../utils/PACSFetchers';
import {withAuthentication} from '../utils/WithAuthentication';
import removeSeriesFromLocalStorage from '../utils/RemoveSeriesFromLocalStorage';
import removeStudiesFromLocalStorage from '../utils/RemoveStudiesFromLocalStorage';
import {saveSeriesData, saveStudyData} from '../utils/Savers';
import {getStudyData} from '../utils/DatabaseFetchers';
import {postValidationData} from '../utils/ValidationFetchers';
import {
  fetchProjectDefaultTemplates,
  fetchProjectTemplates,
  fetchProjects,
  fetchSession,
  patchSession,
  postSession
} from '../utils/MAFILFetchers';
import {
  FormattedMeasurement,
  FormattedSession,
  FormattedTemplate,
  MissingSeries,
  PACSSeries,
  Project,
  SeriesData,
  StudyProps,
  ValidatedSeries
} from '../../../shared/Types';
import ExpandButton from '../components/common/ExpandButton';
import { getTemplateFromSession } from '../utils/SessionToTemplate';

export interface StudyData {
  study_instance_uid: string;
  general_comment: string;
}

function Measuring() {
  const auth = useAuth();
  const [open, setOpen] = React.useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pacsSeries, setPacsSeries] = useState<PACSSeries[]>([]);
  const [mafilMeasurements, setMafilMeasurements] = useState<FormattedMeasurement[]>([]);
  const [session, setSession] = useState<FormattedSession>({
    uuid: '',
    visit: '',
    comment: '',
    measurements: [],
    studyInstanceUID: ''
  });
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
  const [expanded, setExpanded] = useState(false);
  const [reDonwloadNewSession, setReDownloadNewSession] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [studyData, setStudyData] = useState<StudyData>({
    study_instance_uid: props.StudyInstanceUID,
    general_comment: '',
  });
  const [studyTemplates, setStudyTemplates] = useState<FormattedTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // init data
  useEffect(() => {
    fetchSessionAndMeasurements();
    fetchProjectAndTemplates();
    (async () => {
      const fetchedStudyData = await getStudyData(props.StudyInstanceUID);
      setStudyData(fetchedStudyData);
    })();
  }, []);

  // refetch data
  useEffect(() => {
    fetchSessionAndMeasurements();
  },[reDonwloadNewSession]);

  // apply template
  useEffect(() => {
    (async () => {
      const choosenTemplate = studyTemplates.find((template) => template.id === selectedTemplateId);
      const {validatedSeries, missingSeries} = await postValidationData(pacsSeries, choosenTemplate);
      setValidatedSeries(validatedSeries);
      setMissingSeries(missingSeries);
    })()
  }, [studyTemplates, selectedTemplateId, pacsSeries]);

  // save study data
  useEffect(() => {
    localStorage.setItem(`study-${props.StudyInstanceUID}`, JSON.stringify({...studyData}))
  }, [studyData]);

  async function saveRecords(): Promise<boolean> {
    setSaveStatus('saving');
    const seriesSuccess = await saveSeriesData(props.StudyInstanceUID);
    const studySuccess = await saveStudyData(props.StudyInstanceUID);
    var sessionSucess = false;
    if (session.uuid !== undefined) {
      sessionSucess = await patchSession(auth.user ? auth.user.access_token : '', session);
    } else {
      sessionSucess = await postSession(auth.user ? auth.user.access_token : '', {...session, visit: props.AccessionNumber, studyInstanceUID: props.StudyInstanceUID});
      setReDownloadNewSession(true);
    }
    if (seriesSuccess && studySuccess && sessionSucess) {
      setSaveStatus('success');
      return true;
    }
    setSaveStatus('failed');
    return false;
  }

  async function fetchProjectAndTemplates() {
    try {
      const fetchedProjects: Project[] = await fetchProjects(auth.user ? auth.user.access_token : '');
      const project = fetchedProjects.find((project) => project.acronym == props.ReferringPhysicianName);
      const fetchedTemplates: FormattedTemplate[] = await fetchProjectTemplates(project ? project.uuid : '', auth.user ? auth.user.access_token : '');
      const defaultTemplate = await fetchProjectDefaultTemplates(project ? project.uuid : '', auth.user ? auth.user.access_token : '');
      if (defaultTemplate !== undefined && selectedTemplateId == '') {
        setSelectedTemplateId(defaultTemplate.id);
      }
      setStudyTemplates(fetchedTemplates);
    } catch (err) {
    }
  }

  async function fetchSessionAndMeasurements() {
    setFetchStatus('saving');
    const currentStudyString = localStorage.getItem('currentStudy');
    if (currentStudyString) {
      try {
        const currentStudy = JSON.parse(currentStudyString);
        const json = await fetchSeries(currentStudy.AccessionNumber);
        // Sort the series by series number, highest (newly added) first
        json.sort((a: PACSSeries, b: PACSSeries) => a.SeriesNumber - b.SeriesNumber);
        setFetchError(null);
        setFetchStatus('success');
        setPacsSeries(json);

        try {
          const newSession = await fetchSession(auth.user ? auth.user.access_token : '', currentStudy.StudyInstanceUID);
          if ((session.uuid == '' && newSession !== undefined) || reDonwloadNewSession) {
            setMafilMeasurements(newSession.measurements);
            setSession(newSession);
            setReDownloadNewSession(false);
          }
        } catch (error) {
        }

      } catch (error) {
        setFetchStatus('failed');
        setFetchError('Fetching series failed, check internet connection and try again. If problem persists, contact your system administrator.');
      }
    }
    setLoading(false);
  }

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

  function handleRefresh() {
    fetchSessionAndMeasurements();
    fetchProjectAndTemplates();
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
  function saveAsTemplate() {
    const template = getTemplateFromSession(session);
    localStorage.setItem('isFromSession', 'true');
    localStorage.setItem('currentTemplate', JSON.stringify(template));
  }


  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setSession({...session, [name]: value});
    setStudyData({
      ...studyData,
      [name]: value,
    });
  };

  function handleSeriesChange(measurement: SeriesData, order: number | null = null) {
    const filteredPacsSeries = pacsSeries.filter((s) => s.SeriesInstanceUID == measurement.series_instance_uid);
    const pacsSerie = filteredPacsSeries[0];
    setSession(prevSession => {
      const updatedMeasurements = prevSession.measurements !== undefined
        ? prevSession.measurements.filter(m => m.series_instance_UID !== measurement.series_instance_uid)
        : [];
        const newMeasurement: FormattedMeasurement = {
          log_file_name: measurement.stim_log_file,
          stimulation_protocol: measurement.stim_protocol,
          raw_file_name: measurement.fyzio_raw_file,
          order_of_measurement: order ? order : 0,
          study_id: props.StudyID,
          comment: measurement.comment,
          series_instance_UID: measurement.series_instance_uid,
          fyzio_EKG: measurement.bp_ekg,
          fyzio_respiration_belt: measurement.bp_resp,
          fyzio_GSR: measurement.bp_gsr,
          fyzio_ACC: measurement.bp_acc,
          fyzio_pulse_oxymeter: measurement.general_et,
          fyzio_external: measurement.general_eeg,
          siemens_EKG: measurement.siemens_ekg,
          siemens_respiration: measurement.siemens_resp,
          siemens_PT: measurement.siemens_pt,
          time_of_measurement:  new Date(measurement.measured),
          series_description: pacsSerie.SeriesDescription,
          series_number: pacsSerie.SeriesNumber,
          protocol_name: pacsSerie.ProtocolName,
          software_version: pacsSerie.SoftwareVersions,
          body_part_examined: pacsSerie.BodyPartExamined,
          repetition_time: pacsSerie.RepetitionTime,
          flip_angle: pacsSerie.FlipAngle,
          spacing_between_slices: pacsSerie.SpacingBetweenSlices,
          slice_thickness: pacsSerie.SliceThickness,
          patient_position: pacsSerie.PatientPosition,
          inversion_time: pacsSerie.InversionTime,
        }
      return { ...prevSession, measurements: [...updatedMeasurements, newMeasurement] };
    });
  }

  function listSeries() {
    var order = 0;

    return [
      ...validatedSeries.map((series) => { 
        order = order + 1;
      return (
        <Series
          key={`validated-${series.SeriesInstanceUID}`}
          order={order}
          validatedSerie={series}
          templateSerie={null}
          downloadedMeasurement={
            mafilMeasurements !== undefined
              ? mafilMeasurements.filter((measurement) => measurement.series_instance_UID == series.SeriesInstanceUID)[0] 
              : null
          }
          onCopy={handleSeriesCopy}
          onPaste={handleSeriesPaste}
          allExpanded={expanded}
          choosenTemplate={selectedTemplateId}
          onChange={handleSeriesChange}
          projectAcronym={props.ReferringPhysicianName}
          visitId={props.AccessionNumber}
        />
      )}),
      ...missingSeries.map((series) => {
        order = order + 1;
        return (
        <Series
          key={`missing-${series.SeriesDescription}`}
          validatedSerie={null}
          templateSerie={series}
          downloadedMeasurement={null}
          onCopy={handleSeriesCopy}
          onPaste={handleSeriesPaste}
          allExpanded={expanded}
          choosenTemplate={selectedTemplateId}
          onChange={handleSeriesChange}
          order={order}
          projectAcronym={props.ReferringPhysicianName}
          visitId={props.AccessionNumber}
        />
      )}),
    ];
  }

  return (
    <SidebarProvider>
      <React.Fragment>
        <CommonAppBar
          open={open}
          toggleDrawer={toggleDrawer}
          pageTitle={"Measuring and taking notes"}
          content={
            <React.Fragment>
              <SortButton sortOrder={sortOrder} onClick={toggleSortOrder}/>
              <ExpandButton expanded={expanded} onClick={toggleExpand}/>
              <SaveButton saveStatus={saveStatus} onClick={saveRecords}/>
              <RefreshButton fetchStatus={fetchStatus} onClick={handleRefresh}
                             tooltipTitle='Re-fetch series for current study'/>
            </React.Fragment>
          }
        />
        <ResizableSidebar
          open={open}
          toggleDrawer={toggleDrawer}
        >
          <InfoItem label='Measuring operator' text={auth.user ? auth.user.profile.name : ''}/>
          <InfoItem label='Project' text={props.ReferringPhysicianName} hint='ReferringPhysicianName'/>
          <InfoItem label='Visit ID' text={props.AccessionNumber} hint='AccessionNumber'/>
          <InfoItem label='Study UID' text={props.StudyInstanceUID} hint='StudyInstanceUID'/>
          <InfoItem label='Patient name' text={props.PatientName} hint='PatientName'/>
          <InfoItem label='Patient ID' text={props.PatientID} hint='PatientID'/>
          <TemplateDropdown
            selectedTemplate={selectedTemplateId}
            handleTemplateChange={setSelectedTemplateId}
            templates={studyTemplates}
            disabled={readOnly}
          />
          <MultiLineInput
            label='General comment to session'
            name='comment'
            value={session.comment}
            onChange={handleTextChange}
            disabled={readOnly}
          />
          <BlueButton text='Save' path='/success' onClick={handleFinishStudy} sx={{marginBottom:'16px'}}/>

          <Box gap={2} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='space-between'>
            <BlueButton text='Save as template' path='/template-edit' onClick={saveAsTemplate}/>
            <RedButton text='Back to studies' path='/studies' onClick={handleBackToStudies}/>
          </Box>
          <Divider sx={{my: 3}}/>
        </ResizableSidebar>
        <ListItems
          loading={loading}
          list={listSeries()}
          errorMessage={fetchError}
          loadingMessage={`Fetching series...`}
        />
      </React.Fragment>
    </SidebarProvider>
  );
}

const ProtectedMeasuring = withAuthentication(Measuring);
export default ProtectedMeasuring;
