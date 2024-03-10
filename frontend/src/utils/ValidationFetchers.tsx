import { PACSSeries, FormattedTemplate, ValidatedSeries, MissingSeries} from "../../../shared/Types"


export async function postValidationData(series: PACSSeries[], template: FormattedTemplate)
  : Promise<{validatedSeries: ValidatedSeries[], missingSeries: MissingSeries[]}> {
    const url = `/api/series/validate`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          series: series,
          template: template,
        }),
      });
  
      const responseData = await response.json();
      return responseData;
    } catch (err) {
      throw err;
    }
  }