import { Box, Checkbox, Divider, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, TextareaAutosize, Toolbar, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState, version } from "react";
import { BlueButton, RedButton } from "../components/common/Buttons";
import InfoItem from "../components/common/InfoItem";
import ListItems from "../components/common/ListItems";
import { ResizableSidebar } from "../components/global/ResizableSidebar";
import { SidebarProvider } from "../contexts/SidebarContext";
import CommonAppBar from '../components/global/AppBarContent';
import { useAuth } from "react-oidc-context";
import { FormattedTemplate, Project } from "../../../shared/Types";
import { TemplateItemCard } from "../components/templates/TemplateItemCard";
import { fetchProjects } from "../utils/MAFILFetchers";
import { MultiLineInput, SingleLineInput } from "../components/common/Inputs";
import AddIcon from '@mui/icons-material/Add';
import AddMeasurementTemplateDialog from '../components/templates/AddMeasurementTemplateDialog';


export default function EditTemplate() {
  const theme = useTheme();

  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddMeasurementDialogOpen, setIsAddMeasurementDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [props, setProps] = useState<FormattedTemplate>(() => {
    const currentTemplate = localStorage.getItem(`currentTemplate`);
    const template: FormattedTemplate = currentTemplate ? JSON.parse(currentTemplate) : {
      name: "",
      version: 1,
      id: '',
      is_default: false,
      order_for_displaying: null,
      comment: null,
      measurementTemplates: []
    };
    if (template.name == '') {
      setIsNew(true);
    }
    setLoading(false);
    return template;
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const handleDelete = (name: string) => {
    const newTemplates = props.measurementTemplates.filter((template) => template.name !== name)
    setProps({...props, measurementTemplates: newTemplates});
  };

  const saveTemplate = () => {
    setIsNew(false);
    console.log("saving template")
  };

  const handleBackToTemplates = () => {
    localStorage.setItem('currentTemplate', "");
  }

  const listTemplates = () => {
    if (props.measurementTemplates == undefined) {
      return [];
    }
    return [
      ...props.measurementTemplates.map((template) => (
        <TemplateItemCard {...{template: template, onDelete: handleDelete, key: template.name}}
        />
      ))
    ];
  }

  async function fetchData() {
    const fetchedProjects: Project[] = await fetchProjects(auth.user ? auth.user.access_token : '');
    setProjects(fetchedProjects);
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

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
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
  };

  function addMeasurementTemplate(name: string) {
    console.log("aaaa");
    const templates = [...props.measurementTemplates,{
      name: name,
      order_for_displaying: null,
      compulsory: true,
      comment: null,
      measurement_template_pairs: []
    }];
    console.log("bbbb");

    setProps({...props, measurementTemplates: templates});
    console.log("cccc");
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
          <InfoItem label="Measuring operator" text={auth.user ? auth.user.profile.name : ''} />
          <Box gap={2} display='flex' flexDirection="row" flexWrap='wrap' justifyContent="space-between">
            <BlueButton text="Save template" path="/templates" onClick={saveTemplate} />
            <RedButton text="Back to templates" path="/templates" onClick={handleBackToTemplates} />
          </Box>
          <Divider sx={{ my: 3 }} />
        </ResizableSidebar>
        <AddMeasurementTemplateDialog open={isAddMeasurementDialogOpen} onClose={closeDialog} onConfirm={addMeasurementTemplate}></AddMeasurementTemplateDialog>
        <React.Fragment>
          <Box width={'100%'}>
            <Toolbar sx={{ minHeight: theme.mixins.toolbar.minHeight }} />

            <Box width={'100%'} mt={2} sx={{margin: 2}}>
              <Box
                fontWeight={'bold'}
                fontSize={22}
                whiteSpace={'break-spaces'}
                flexDirection={'row'}
              >
                {!isNew ? 
                  `Name: ${props.name} | Version: ${props.version}` :
                  <Box width={'65%'}>
                    <SingleLineInput
                    name="name"
                    label="Name"
                    value={props.name}
                    onChange={handleTextChange}
                  />
                  </Box>
                }
                
              </Box>

              <Box display={'flex'} flexDirection={'row'} mt={2}>
                <FormControl style={{width: '300px'}}>
                  <InputLabel>Select Project</InputLabel>
                  <Select
                    onChange={onProjectChanged}
                    label="Select Project"
                    value={selectedProjectId || ''}
                  >
                    <MenuItem value="" disabled>
                      Select a project
                  </MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.uuid} value={project.uuid} selected={false}>
                        {project.acronym}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div style={{ marginLeft: '10px' }} />
                <FormControlLabel control={
                  <Checkbox
                    checked={false}
                    onChange={handleIsDefaultChange}
                    name="is_default"
                    color="primary"
                  />
                } label='Is default' />
                </Box>
                <Box display={'flex'} flexDirection={'row'} mt={2}>
                <Box sx={{width: '600px', marginRight: '10px'}}>
                  <MultiLineInput
                    name="comment"
                    label="Comment"
                    value={props.comment ? props.comment : ""}
                    onChange={handleTextChange}
                  />
                </Box>                
                <Box sx={{width: '100px'}}>
                  <SingleLineInput
                    name="order_for_displaying"
                    type="number"
                    label="Order"
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
                aria-label="add"
                onClick={() => setIsAddMeasurementDialogOpen(true)}
              >
                <AddIcon />

              </IconButton>
            </Box>

            <Box sx={{marginLeft: 2}}>
            <ListItems
                  loading={loading}
                  list={listTemplates()}
                  errorMessage={''}
                  loadingMessage={`Fetching template...`}
                  hasToolbar={false}
                  maxHeight="55vh"
                />              
            </Box>

          </Box>

        </React.Fragment>
        
      </React.Fragment>
    </SidebarProvider >
    )
}