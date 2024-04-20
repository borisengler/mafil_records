import { FormattedTemplate, Project } from "../../../shared/Types";
import axios from 'axios';

export async function fetchStudyTemplates(study_id: string, token: string | undefined) {
    const url = `/api/study/${study_id}/template`;
    try {
      const headers = {
        'token': token
      };
      const response = await axios.get(url, { headers });
      const templates: FormattedTemplate[] = await response.data;

      return templates;
    } catch (err) {
      throw err;
    }
  }

export async function fetchTemplates(token: string | undefined) {
  const url = `/api/template`;
  try {
    const headers = {
      'token': token
    };
    const response = await axios.get(url, { headers });

    const templates: FormattedTemplate[] = await response.data;
    return templates;
  } catch (err) {
    throw err;
  }
}
  
  
export async function fetchProjects(token: string | undefined) {
  const url = `/api/project`;

  try {
    const headers = {
      'token': token
    };
    const response = await axios.get(url, { headers });

    const projects: Project[] = await response.data;
    return projects;
  } catch (err) {
    throw err;
  }
}

export async function fetchStudyDefaultTemplates(study_id: string, token: string | undefined) {
  const url = `/api/study/${study_id}/default_template`;
  try {
    const headers = {
      'token': token
    };
    const response = await axios.get(url, { headers });

    if (response.status == 204) {
      return;
    }
    const template: FormattedTemplate = await response.data;
    return template;
  } catch (err) {
    throw err;
  }
}