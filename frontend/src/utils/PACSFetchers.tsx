import DateRange from '../components/studies/DateRangeSelector';
import {PacsStudyAPI, PacsStudy, PACSSeries} from "../../../shared/Types";

export async function fetchStudies(dateRange: DateRange) {
  const url = `/api/pacs/studies?start=${dateRange.start}&end=${dateRange.end}`;

  try {
    const resp = await fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
      });
    const visits = await resp.json();
    const parsedVisits = visits.map((visit: any) => {
      const parsedDate = new Date(visit.StudyDate.substr(0, 4), parseInt(visit.StudyDate.substr(4, 2)) - 1, visit.StudyDate.substr(6, 2));
      return { ...visit, StudyDate: parsedDate };
    });
    return parsedVisits;
  } catch (err) {
    throw err;
  }
}

export async function fetchSeries(accessionNumber: string) {
  const url = `/api/pacs/series?accession_number=${accessionNumber}`;

  try {
    const resp = await fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
      });
    const series: PACSSeries[] = await resp.json();
    return series;
  } catch (err) {
    console.error(err)
    throw err;
  }
}
