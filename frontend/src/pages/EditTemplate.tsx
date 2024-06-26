import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  useTheme
} from '@mui/material';
import React, {useEffect, useState, version} from 'react';
import {BlueButton, RedButton} from '../components/common/Buttons';
import InfoItem from '../components/common/InfoItem';
import ListItems from '../components/common/ListItems';
import {ResizableSidebar} from '../components/global/ResizableSidebar';
import {SidebarProvider} from '../contexts/SidebarContext';
import CommonAppBar from '../components/global/AppBarContent';
import {useAuth} from 'react-oidc-context';
import {FormattedTemplate, MeasurementTemplate, Project} from '../../../shared/Types';
import {TemplateItemCard} from '../components/templates/TemplateItemCard';
import {fetchProjects, postTemplate, patchTemplate} from '../utils/MAFILFetchers';
import {MultiLineInput, SingleLineInput} from '../components/common/Inputs';
import AddIcon from '@mui/icons-material/Add';
import AddMeasurementTemplateDialog from '../components/templates/AddMeasurementTemplateDialog';
import {useNavigate} from 'react-router-dom';


export default function EditTemplate() {
  const theme = useTheme();
  const navigate = useNavigate();

  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddMeasurementDialogOpen, setIsAddMeasurementDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [error, setError] = useState('');

  const [props, setProps] = useState<FormattedTemplate>(() => {
    const currentTemplate = localStorage.getItem(`currentTemplate`);
    const isFromSession = localStorage.getItem(`isFromSession`) == 'true';
    localStorage.setItem('isFromSession', '');
    const template: FormattedTemplate = currentTemplate ? JSON.parse(currentTemplate) : {
      name: '',
      version: 1,
      id: '',
      is_default: false,
      order_for_displaying: null,
      comment: '',
      measurementTemplates: []
    };
    if (template.name == '' || isFromSession) {
      setIsNew(true);
    }
    setLoading(false);
    var id = 0;
    template.measurementTemplates = template.measurementTemplates.map((m) => {
      id = id + 1;
      return {
        ...m, id: id
      }
    })
    return template;
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

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

  const handleDelete = (name: string) => {
    const newTemplates = props.measurementTemplates.filter((template) => template.name !== name)
    setProps({...props, measurementTemplates: newTemplates});
  };

  async function saveTemplate() {
    if (isNew) {
      const newTemplate = await postTemplate(auth.user ? auth.user.access_token : '', props)
      if (newTemplate !== undefined) {
        setIsNew(false);
        navigate('/templates');
      } else {
        setError('Template can\'t be saved. Make sure all required fileds are filled.');
      }
    } else {
      const newTemplate = await patchTemplate(auth.user ? auth.user.access_token : '', props)
      if (newTemplate !== undefined) {
        navigate('/templates');
      } else {
        setError('Template can\'t be saved. Make sure all required fileds are filled.');
      }
    }
  };

  const saveMeasurement = (changed_template: MeasurementTemplate) => {
    const oldMeasurementTemplates = props.measurementTemplates.filter((template) => template.id != changed_template.id)
    setProps({...props, measurementTemplates: [...oldMeasurementTemplates, changed_template]});
  }

  const handleBackToTemplates = () => {
    localStorage.setItem('currentTemplate', '');
  }

  const listTemplates = () => {
    if (props.measurementTemplates == undefined) {
      return [];
    }
    return [
      ...props.measurementTemplates.sort((a, b) => {
        const order_a = a.order_for_displaying ? a.order_for_displaying : 100;
        const order_b = b.order_for_displaying ? b.order_for_displaying : 100;
        return order_a - order_b;
      }).map((template) => {
        return <TemplateItemCard {...{
          template: {...template},
          onChange: saveMeasurement,
          onDelete: handleDelete,
          key: template.id
        }}
        />
      })
    ];
  }

  async function fetchData() {
    const fetchedProjects: Project[] = await fetchProjects(auth.user ? auth.user.access_token : '');
    setProjects(fetchedProjects);
    setSelectedProjectId(props.project_uuid);
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setProps({
      ...props,
      [name]: value,
    });
  };

  const handleIsDefaultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProps({
      ...props,
      is_default: event.target.checked
    });
  };

  const onProjectChanged = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedProjectId(selectedValue);
    setProps({
      ...props,
      project_uuid: selectedValue
    })
  };

  function addMeasurementTemplate(name: string) {
    const ids: number[] = props.measurementTemplates.map((t) => t.id).filter((id): id is number => id !== undefined);
    const id = ids.length == 0 ? 1 : Math.max(...ids) + 1;

    const templates = [...props.measurementTemplates, {
      name: name,
      order_for_displaying: null,
      compulsory: true,
      comment: '',
      measurement_template_pairs: [],
      id: id
    }];

    setProps({...props, measurementTemplates: templates});
    setIsAddMeasurementDialogOpen(false);
  }

  function closeDialog() {
    setIsAddMeasurementDialogOpen(false);
  }

  return (
    <SidebarProvider>
      <React.Fragment>
        <CommonAppBar
          open={open}
          toggleDrawer={toggleDrawer}
          pageTitle='Template detail'
          content={
            <React.Fragment>
              <></>
            </React.Fragment>
          }
        />
        <ResizableSidebar
          open={open}
          toggleDrawer={toggleDrawer}
        >
          <InfoItem label='Measuring operator' text={auth.user ? auth.user.profile.name : ''}/>
          <Box gap={2} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='space-between'>
            <BlueButton text='Save template' onClick={saveTemplate}/>
            <RedButton text='Back to templates' path='/templates' onClick={handleBackToTemplates}/>
          </Box>
          <Divider sx={{my: 3}}/>
        </ResizableSidebar>
        <AddMeasurementTemplateDialog open={isAddMeasurementDialogOpen} onClose={closeDialog}
                                      onConfirm={addMeasurementTemplate}></AddMeasurementTemplateDialog>
        <React.Fragment>
          <Box width={'100%'}>
            <Toolbar sx={{minHeight: theme.mixins.toolbar.minHeight}}/>
            {error != '' &&<Box width={'100%'} mt={2} sx={{margin: 2}}>
                <Box
                    fontWeight={'bold'}
                    fontSize={22}
                    whiteSpace={'break-spaces'}
                    flexDirection={'row'}
                    color={'red'}
                  >
                    {error}
                </Box>
              </Box>
            }
            <Box width={'100%'} mt={2} sx={{margin: 2}}>
              <Box
                fontWeight={'bold'}
                fontSize={22}
                whiteSpace={'break-spaces'}
                flexDirection={'row'}
              >
                  <Box width={'65%'}>
                    <SingleLineInput
                      name='name'
                      label='Name'
                      value={props.name}
                      onChange={handleTextChange}
                      required={true}
                    />
                  </Box>
              </Box>
              {
                isNew ?
                  <Box display={'flex'} flexDirection={'row'} mt={2}>
                      <FormControl style={{width: '300px'}}>
                          <InputLabel>Select Project</InputLabel>
                          <Select
                              onChange={onProjectChanged}
                              label='Select Project'
                              value={selectedProjectId || ''}
                          >
                              <MenuItem value='' disabled>
                                  Select a project
                              </MenuItem>
                            {projects.map((project) => (
                              <MenuItem key={project.uuid} value={project.uuid} selected={false}>
                                {project.acronym}
                              </MenuItem>
                            ))}
                          </Select>
                      </FormControl>

                      <div style={{marginLeft: '10px'}}/>
                      <FormControlLabel control={
                        <Checkbox
                          checked={props.is_default}
                          onChange={handleIsDefaultChange}
                          name='is_default'
                          color='primary'
                        />
                      } label='Is default'/>
                  </Box> :
                  <Box
                  fontWeight={'bold'}
                  fontSize={22}
                  whiteSpace={'break-spaces'}
                  flexDirection={'row'}
                  sx={{marginTop: '10px'}}
                > Version: {props.version} | Project: {props.project_name}</Box>
              }

              <Box display={'flex'} flexDirection={'row'} mt={2}>
                <Box  sx={{
                    flex: '1 1 500px',
                    marginRight: '10px',
                    maxWidth: '600px',
                  }}>
                  <MultiLineInput
                    name='comment'
                    label='Comment'
                    value={props.comment}
                    onChange={handleTextChange}
                  />
                </Box>
                <Box sx={{flex: '0 0 100px', marginRight: '20px',}}>
                  <SingleLineInput
                    name='order_for_displaying'
                    type='number'
                    label='Order'
                    value={props.order_for_displaying ? props.order_for_displaying.toString() : '0'}
                    onChange={handleTextChange}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{marginLeft: 2}}
                 fontWeight={'bold'}
                 fontSize={20}
                 whiteSpace={'break-spaces'}
                 flexDirection={'row'}
            >
              Measurements
              <IconButton
                aria-label='add'
                onClick={() => setIsAddMeasurementDialogOpen(true)}
              >
                <AddIcon/>
              </IconButton>
            </Box>

            <Box sx={{marginLeft: 2}}>
              <ListItems
                loading={loading}
                list={listTemplates()}
                errorMessage={''}
                loadingMessage={`Fetching template...`}
                hasToolbar={false}
                maxHeight={!isNew ? (error == '' ? '57vh': '49vh') : (error == '' ? '55vh': '45vh')}
              />
            </Box>
          </Box>
        </React.Fragment>
      </React.Fragment>
    </SidebarProvider>
  )
}