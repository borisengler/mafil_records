import { MissingSeries, SeriesProps, ValidatedSeries, MeasurementTemplate,MeasurementTemplatePair, FormattedTemplate, PACSSeries} from '../../../shared/Types';

export const validateSeriesWithMeasurementTemplate = (serie: PACSSeries, template: FormattedTemplate) : ValidatedSeries=> {
    const assignedTemplate: MeasurementTemplate = template.measurementTemplates.find((template) => serie.SeriesDescription.startsWith(template.name));

    if (assignedTemplate === undefined) {
        return {
            ...serie,
            ValidationResult: "NOT_FOUND",
            UserInput: [],
            OrderForDisplaying: 1000 + serie.SeriesNumber
        };
    }

    const userInput = assignedTemplate?.measurement_template_pairs?.filter(pair => pair.user_input === true) || [];
    const isValid = validateSeriesWithTemplate(serie, assignedTemplate);
    if (isValid) {
        return {
            ...serie,
            ValidationResult: "OK",
            UserInput: userInput,
            OrderForDisplaying: assignedTemplate.order_for_displaying
        }
    }

    return {
        ...serie,
        ValidationResult: "NOK",
        UserInput: userInput,
        OrderForDisplaying: assignedTemplate.order_for_displaying
    }
};

const validateSeriesWithTemplate = (serie: PACSSeries, template: MeasurementTemplate) : boolean => {
    if (template.measurement_template_pairs == null) {
        return true;
    }
    for (const pair of template.measurement_template_pairs) {
        
        if (!validateSeriesWithPair(serie, pair)) {
            return false;
        }
    };

    return true;
}
const validateSeriesWithPair = (serie: PACSSeries, pair: MeasurementTemplatePair): boolean => {
    if (!pair.user_input) {
        if (pair.type_of_comparison == "equal") {
            if (serie[pair.key_source] != pair.valueA) {
                return false;
            }
        }
        if (pair.type_of_comparison == "range") {
            if (
                (pair.valueA != undefined && serie[pair.key_source] < pair.valueA)
                || (pair.valueB != undefined && serie[pair.key_source] > pair.valueB)
            ) {
                return false;
            }
        }
    }
    return true;
}

export const findMissingSeries = (series: PACSSeries[], template: FormattedTemplate): MissingSeries[] => {
    const measurementTemplates: MeasurementTemplate[] = template.measurementTemplates;

    const missingTemplates = measurementTemplates.filter((template) => {
        return !series.some((serie) => serie.SeriesDescription === template.name);
    });

    return missingTemplates.map((template) => missingTemplatesToMissingSeries(template));
}

const missingTemplatesToMissingSeries = (template: MeasurementTemplate): MissingSeries => {
    const userInputPairs = template.measurement_template_pairs?.filter(pair => pair.user_input === true) || [];
    return {
        UserInput: userInputPairs,
        SeriesDescription: template.name,
        OrderForDisplaying: template.order_for_displaying,
        ValidationResult: 'MISSING'
    }
}