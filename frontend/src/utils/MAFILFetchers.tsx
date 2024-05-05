import { FormattedTemplate, Project, Template, Session } from "../../../shared/Types";
import axios from 'axios';

export async function fetchProjectTemplates(project_id: string | undefined, token: string | undefined) {
    const url = `/api/project/${project_id}/template`;
    try {
      const headers = {
        'token': token
      };
      const response = await axios.get(url, { headers });
      const templates: FormattedTemplate[] = await response.data;
      return templates;
    } catch (err) {
      return [];
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
    return [];
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
    return [];
  }
}

export async function fetchProjectDefaultTemplates(project_id: string | undefined, token: string | undefined) {
  const url = `/api/project/${project_id}/default_template`;
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

export async function fetchSession(token: string | undefined, studyInstanceUID: string) {
  const url = `/api/session/${studyInstanceUID}`;

  // TODO zatial nepouzivam
  try {
    const headers = {
      'token': token
    };
    const response = await axios.get(url, { headers });

    const visit: Session = await response.data;
    return visit;
  } catch (err) {
    return [];
  }
}



export async function postTemplate(token: string | undefined, template: FormattedTemplate) {
  const url = `/api/template`;

  try {
    const headers = {
      'token': token,
      'Content-Type': 'application/json'
    };
    const body = {     
      is_default: template.is_default,
      name: template.name,
      order_for_displaying: template.order_for_displaying,
      measurement_modality: "mr",
      project: template.project_uuid,
      comment: template.comment,
      versioned_templates: [{
        comment: template.comment,
        version: template.version,
        created_from: null,
        measurement_templates: template.measurementTemplates
      }]
    };

    const response = await axios.post(url, body, { headers });

    const newTemplate: Template = await response.data;
    return newTemplate;
  } catch (err) {
    return;
  }
}


export async function patchTemplate(token: string | undefined, template: FormattedTemplate) {
  const url = `/api/template/${template.id}`;

  try {
    const headers = {
      'token': token,
      'Content-Type': 'application/json'
    };
    const body = {
      is_default: template.is_default,
      name: template.name,
      order_for_displaying: template.order_for_displaying,
      measurement_modality: "mr",
      project: template.project_uuid,
      is_defeault: template.is_default,
      versioned_templates: [{
        comment: template.comment ? template.comment : '',
        version: template.version,
        created_from: null,
        measurement_templates: template.measurementTemplates
      }]
    };

    const response = await axios.patch(url, body, { headers });

    const newTemplate: Template = await response.data;
    return newTemplate;
  } catch (err) {
    return;
  }
}

export async function deleteTemplate(token: string | undefined, template: FormattedTemplate) {
  const url = `/api/template/${template.id}/${template.version}`;
  try {
    const headers = {
      'token': token,
    };
    const response = await axios.delete(url, { headers });
    return;
  } catch (err) {
    return;
  }
}
