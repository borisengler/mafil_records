

export const validateSeriesWithMeasurementTemplate: ValidatedSeries = (serie: SeriesProps, template: FormattedTemplate) => {

    const assignedTemplate: MeasurementTemplate = template.measurementTemplates.find((template) => template.name === serie.SeriesDescription);

    if (assignedTemplate === undefined) {
        return {
            ...serie,
            ValidationResult: "NOT_FOUND"
        };
    }

    const userInput = assignedTemplate.measurementTemplatePairs.filter(pair => pair.user_input === true);
    const isValid = validateSeriesWithTemplate(serie, assignedTemplate);
    if (isValid) {
        return {
            ...serie,
            ValidatinoResult: "OK",
            userInput: userInput
        }
    }

    return {
        ...serie,
        ValidationResult: "NOK",
        userInput: userInput
    }
};

const validateSeriesWithTemplate: boolean = (serie: SerieProps, template: MeasurementTemplate) => {
    if (template.measurementTemplatePairs == null) {
        return true;
    }
    for (const pair of template.measurementTemplatePairs) {
        
        if (!validateSeriesWithPair(serie, pair)) {
            return false;
        }
    };

    return true;
}
const validateSeriesWithPair: boolean = (serie: SerieProps, pair: MeasurementTemplatePair) => {
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

export const findMissingSeries = (series: SerieProps[], template: FormattedTemplate) => {
    const measurementTemplates: MeasurementTemplate[] = template.measurementTemplates;

    const missingTemplates = measurementTemplates.filter((template) => {
        return !series.some((serie) => serie.SeriesDescription === template.name);
    });

    return missingTemplates.map((template) => missingTemplatesToMissingSeries(template));
}

const missingTemplatesToMissingSeries: MissingSeries = (template: MeasurementTemplate) => {
    const userInputPairs = template.measurementTemplatePairs?.filter(pair => pair.user_input === true) || [];
    return {
        UserInput: userInputPairs,
        SeriesDescription: template.name
    }
}