import { FormattedTemplate, Project } from "../../../shared/Types";
const axios = require('axios');

export async function fetchStudyTemplates(study_id: string) {
    const url = `/api/study/${study_id}/template`;
    try {
      const response = await fetch(
        url,
        {
          method: 'GET',
          mode: 'cors',
        });

      const templates: FormattedTemplate[] = await response.json();
      return templates;
    } catch (err) {
      throw err;
    }
  }

export async function fetchTemplates() {
  const url = `/api/template`;
  try {
    const response = await fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
      });

    const templates: FormattedTemplate[] = await response.json();
    return templates;
  } catch (err) {
    throw err;
  }
}
  
  
export async function fetchProjects(token: string | undefined) {
  const url = `/api/project?token=${token}`;
  try {
    const response = await fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
      });

    const projects: Project[] = await response.json();
    return projects;
  } catch (err) {
    throw err;
  }
}

export async function fetchStudyDefaultTemplates(study_id: string) {
  const url = `/api/study/${study_id}/default_template`;
  try {
    const response = await fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
      });

    if (response.status == 204) {
      return;
    }
    const template: FormattedTemplate = await response.json();
    return template;
  } catch (err) {
    throw err;
  }
}