import { Template } from "../shared/Types"


export async function fetchStudyTemplates(study_id: string) {
    const url = `/api/study/${study_id}/template`;
    try {
      const response = await fetch(
        url,
        {
          method: 'GET',
          mode: 'cors',
        });

      const templates: Template[] = await response.json();
      return templates;
    } catch (err) {
      throw err;
    }
  }