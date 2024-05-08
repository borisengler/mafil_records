import React, {useEffect, useState} from 'react';
import {withAuthentication} from '../utils/WithAuthentication';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {BlueButton, RedButton} from '../components/common/Buttons';
import ListItems from '../components/common/ListItems';
import {ResizableSidebar} from '../components/global/ResizableSidebar';
import {SidebarProvider} from '../contexts/SidebarContext';
import CommonAppBar from '../components/global/AppBarContent';
import InfoItem from '../components/common/InfoItem';
import TemplateCard from '../components/templates/TemplateCard'
import {useAuth} from 'react-oidc-context';
import {FormattedTemplate, Project} from '../../../shared/Types';
import {deleteTemplate, fetchProjects, fetchTemplates} from '../utils/MAFILFetchers';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

function Templates() {
  const auth = useAuth();

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [fetchStatus, setFetchStatus] = useState<'idle' | 'saving' | 'success' | 'failed'>('idle');

  const [templates, setTemplates] = useState<FormattedTemplate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  function deleteVersionedTemplate(template: FormattedTemplate) {
    deleteTemplate(auth.user ? auth.user.access_token : '', template);
    const newTemplates = templates.filter((t) => t.id != template.id);
    setTemplates(newTemplates);
  }


  async function fetchData() {
    setFetchStatus('saving');
    try {
      const fetchedTemplates: FormattedTemplate[] = await fetchTemplates(auth.user ? auth.user.access_token : '');
      const fetchedProjects: Project[] = await fetchProjects(auth.user ? auth.user.access_token : '');
      setProjects(fetchedProjects);
      setTemplates(fetchedTemplates);
      setFetchStatus('success');
      setFetchError(null);
    } catch (error) {
      setFetchStatus('failed');
      setFetchError('Fetching templates failed, check internet connection and try again. If problem persists, contact your system administrator.');
    }
    setLoading(false);
  }

  function listTemplates() {
    const filtered_templates = selectedProjectId == 'all' ? templates : templates.filter((template) => template.project_uuid == selectedProjectId);
    return [...filtered_templates.map((template) => (
      <TemplateCard template={template} key={`${template.id}-${template.version}`} onDelete={deleteVersionedTemplate}/>
    ))]
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    localStorage.setItem('currentTemplate', "");
  };

  const onProjectChanged = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedProjectId(selectedValue);
  };

  return (
    <SidebarProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <React.Fragment>
          <CommonAppBar
            open={open}
            toggleDrawer={toggleDrawer}
            pageTitle='Template administration'
            content={
              <></>
            }
          />
          <ResizableSidebar
            open={open}
            toggleDrawer={toggleDrawer}
          >
            <InfoItem label="Measuring operator" text={auth.user ? auth.user.profile.name : ''}/>
            <BlueButton text="Create template" path="/template-edit" onClick={handleClick}/>
            <FormControl fullWidth>
              <InputLabel>Select Project</InputLabel>
              <Select
                onChange={onProjectChanged}
                label="Select Project"
                value={selectedProjectId || ''}
              >
                <MenuItem key="all" value="all">
                  -All projects-
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.uuid} value={project.uuid} selected={false}>
                    {project.acronym}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <RedButton text="Back to studies" path="/studies"/>
          </ResizableSidebar>
          <ListItems
            loading={loading}
            list={listTemplates()}
            errorMessage={fetchError}
            loadingMessage={`Fetching templates...`}
            emptyMessage={'There are no templates'}
          />
        </React.Fragment>
      </LocalizationProvider>
    </SidebarProvider>
  );
}

const ProtectedTemplates = withAuthentication(Templates);
export default ProtectedTemplates;
