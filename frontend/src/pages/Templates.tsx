import React, { useEffect, useState } from 'react';
import { withAuthentication } from '../utils/WithAuthentication';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BlueButton, RedButton } from '../components/common/Buttons';
import ListItems from '../components/common/ListItems';
import LoginButton from '../components/common/LoginButton';
import RefreshButton from '../components/common/RefreshButton';
import { ResizableSidebar } from '../components/global/ResizableSidebar';
import DateRangeSelector from '../components/studies/DateRangeSelector';
import { SidebarProvider } from '../contexts/SidebarContext';
import CommonAppBar from '../components/global/AppBarContent';
import InfoItem from '../components/common/InfoItem';
import TemplateCard from '../components/templates/TemplateCard'
import { useAuth } from 'react-oidc-context';
import SaveButton from '../components/common/SaveButton';
import { saveTemplatesData } from '../utils/Savers';
import { FormattedTemplate, Project } from '../../../shared/Types';
import { fetchTemplates } from '../utils/MAFILFetchers';
import { Box } from '@mui/material';

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


  async function fetchData() {
    setFetchStatus('saving');
    try {
      const fetchedTemplates: FormattedTemplate[] = await fetchTemplates(auth.user ? auth.user.access_token : '');

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
    return [...templates.map((template) => (
        <TemplateCard template={template} key={`${template.id}-${template.version}`}/>
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
              <InfoItem label="Measuring operator" text={auth.user ? auth.user.profile.name : ''} />
              <BlueButton text="Create template" path="/template-edit" onClick={handleClick}/>
              <RedButton text="Back to studies" path="/studies" />
            </ResizableSidebar>
            <ListItems
              loading={loading}
              list={listTemplates()}
              errorMessage={fetchError}
              loadingMessage={`Fetching templates...`}
              />
          </React.Fragment>
        </LocalizationProvider>
      </SidebarProvider>
    );
}

const ProtectedTemplates = withAuthentication(Templates);
export default ProtectedTemplates;
