import { Box, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BlueButton, RedButton } from "../components/common/Buttons";
import InfoItem from "../components/common/InfoItem";
import { MultiLineInput } from "../components/common/Inputs";
import ListItems from "../components/common/ListItems";
import RefreshButton from "../components/common/RefreshButton";
import SaveButton from "../components/common/SaveButton";
import SortButton from "../components/common/SortButton";
import { ResizableSidebar } from "../components/global/ResizableSidebar";
import { TemplateDropdown } from "../components/series/TemplateDropdown";
import { SidebarProvider } from "../contexts/SidebarContext";
import CommonAppBar from '../components/global/AppBarContent';
import { useAuth } from "react-oidc-context";
import { FormattedTemplate } from "../../../shared/Types";
import { TemplateItemCard } from "../components/templates/TemplateItemCard";


export default function EditTemplate() {

  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [props, setProps] = useState<FormattedTemplate>(() => {
    const currentTemplate = localStorage.getItem(`currentTemplate`);
    const template: FormattedTemplate = currentTemplate ? JSON.parse(currentTemplate) : {};
    setLoading(false);
    return template;
  });

  const handleDelete = (name: string) => {
    const newTemplates = props.measurementTemplates.filter((template) => template.name !== name)
    setProps({...props, measurementTemplates: newTemplates});
  };

  const saveTemplate = () => {
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
              {/* <SaveButton saveStatus={saveStatus} onClick={saveRecords} /> */}
              {/* <RefreshButton fetchStatus={fetchStatus} onClick={handleRefresh} tooltipTitle='Re-fetch series for current study' /> */}
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
        <ListItems
            loading={loading}
            list={listTemplates()}
            errorMessage={fetchError}
            loadingMessage={`Fetching template...`}
          />
      </React.Fragment>
    </SidebarProvider >
    )
}