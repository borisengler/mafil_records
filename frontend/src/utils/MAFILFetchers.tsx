import { FormattedTemplate } from "../../../shared/Types";

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