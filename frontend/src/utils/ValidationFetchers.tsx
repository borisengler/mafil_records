import { SeriesProps, FormattedTemplate} from "../shared/Types"


export async function postValidationData(series: SeriesProps[], template: FormattedTemplate) {
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
      console.log(responseData);
      return responseData;
    } catch (err) {
      throw err;
    }
  }