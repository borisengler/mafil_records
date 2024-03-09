import { validateSeriesWithMeasurementTemplate, findMissingSeries } from "../utils/ValidationFunctions";


export const validateSeriesForTemplate = async (req: Request<{}, {}, SeriesValidationProps>, res) => {
    const validationData: SeriesValidationProps = req.body;
  
    const series = validationData.series;
    const template = validationData.template;

    const validatedSeries: ValidatedSeries[] = validationData.series.map(serie => {
        return validateSeriesWithMeasurementTemplate(serie, validationData.template);
    });

    const missingSeries = findMissingSeries(series, validationData.template);
    console.log('missingSeries');
    console.log(missingSeries);
    res.status(200).json(validatedSeries);
  
  }