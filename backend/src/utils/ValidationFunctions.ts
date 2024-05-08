import {
    MissingSeries,
    ValidatedSeries,
    MeasurementTemplate,
    MeasurementTemplatePair,
    FormattedTemplate,
    PACSSeries
  } from '../../../shared/Types';
  
  export type ValidationResult = {
    result: boolean;
    reasons: string[];
  }
  
  export type ValidationPairResult = {
    result: boolean;
    reason?: string;
  }
  
  export const validateSeriesWithMeasurementTemplate = (serie: PACSSeries, template: FormattedTemplate | undefined): ValidatedSeries => {
    if (template === undefined) {
      return {
        ...serie,
        ValidationResult: "NOT_FOUND",
        UserInput: [],
        InvalidReasons: [],
        OrderForDisplaying: 1000 + serie.SeriesNumber
      };
    }
    const assignedTemplate: MeasurementTemplate = template.measurementTemplates.find((template) => serie.SeriesDescription.startsWith(template.name));
  
    if (assignedTemplate === undefined) {
      return {
        ...serie,
        ValidationResult: "NOT_FOUND",
        UserInput: [],
        InvalidReasons: [],
        OrderForDisplaying: 1000 + serie.SeriesNumber
      };
    }
  
    const userInput = assignedTemplate?.measurement_template_pairs?.filter(pair => pair.user_input === true) || [];
    const {result, reasons} = validateSeriesWithTemplate(serie, assignedTemplate);
    if (result) {
      return {
        ...serie,
        ValidationResult: "OK",
        UserInput: userInput,
        InvalidReasons: [],
        OrderForDisplaying: assignedTemplate.order_for_displaying
      }
    }
  
    return {
      ...serie,
      ValidationResult: "NOK",
      UserInput: userInput,
      InvalidReasons: reasons,
      OrderForDisplaying: assignedTemplate.order_for_displaying
    }
  };
  
  const validateSeriesWithTemplate = (serie: PACSSeries, template: MeasurementTemplate): ValidationResult => {
    if (template.measurement_template_pairs == null) {
      return {result: true, reasons: []};
    }
    var return_result = true;
    var reasons = [];
    for (const pair of template.measurement_template_pairs) {
      const {result, reason} = validateSeriesWithPair(serie, pair)
      if (!result) {
        return_result = false
        reasons = [...reasons, reason]
      }
    }
    ;
  
    return {result: return_result, reasons: reasons};
  }
  const validateSeriesWithPair = (serie: PACSSeries, pair: MeasurementTemplatePair): ValidationPairResult => {
    if (!pair.user_input) {
      if (pair.type_of_comparison == "equal") {
        if (serie[pair.key_source] != pair.valueA) {
          return {
            result: false,
            reason: `${pair.key_source} should equal ${pair.valueA}, but is ${serie[pair.key_source]}`
          };
        }
      }
      if (pair.type_of_comparison == "range") {
        if (
          (pair.valueA != undefined && serie[pair.key_source] < pair.valueA)
          || (pair.valueB != undefined && serie[pair.key_source] > pair.valueB)
        ) {
          const interval = `(${pair.valueA ? pair.valueA : '-∞'},${pair.valueB ? pair.valueB : '∞'})`
          return {
            result: false,
            reason: `${pair.key_source} should be in interval ${interval}, but is ${serie[pair.key_source]}`
          };
        }
      }
    }
    return {result: true};
  }
  
  export const findMissingSeries = (series: PACSSeries[], template: FormattedTemplate | undefined): MissingSeries[] => {
    if (template === undefined) return [];
    const measurementTemplates: MeasurementTemplate[] = template.measurementTemplates;
  
    const missingTemplates = measurementTemplates.filter((template) => {
      return !series.some((serie) => serie.SeriesDescription.startsWith(template.name));
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