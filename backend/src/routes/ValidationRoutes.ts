import { validateSeriesWithMeasurementTemplate, findMissingSeries } from "../utils/ValidationFunctions";
import { ValidatedSeries} from "../../../shared/Types";
import { SeriesValidationProps } from "../model/ValidationProps";

export const validateSeriesForTemplate = async (req, res) => {
    const validationData: SeriesValidationProps = req.body;
  
    const series = validationData.series;
    const template = validationData.template;

    const validatedSeries: ValidatedSeries[] = validationData.series.map(serie => {
        return validateSeriesWithMeasurementTemplate(serie, validationData.template);
    });

    const missingSeries = findMissingSeries(series, validationData.template);
    console.log('missingSeries');
    console.log(missingSeries);
    const result = {
        validatedSeries: validatedSeries,
        missingSeries: missingSeries
    }
    res.status(200).json(result);
  
  }