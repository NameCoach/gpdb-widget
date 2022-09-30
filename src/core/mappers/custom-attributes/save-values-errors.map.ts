export type Errors = { [x: string]: string };
type JSObject = { [x: string]: any };
type MapperOptions = {
  errors: JSObject;
  config: JSObject;
};

const toErrorsString = (obj): string => {
  const rawString = JSON.stringify(obj);

  return rawString.replace(/\{|\}|\[|\]|"|value/gi, "").replace(/:/gi, " ");
};

const unexpectedErrorObject = (
  additionalMessage?: string
): { [x: string]: string } =>
  additionalMessage
    ? {
        _defaultMapperError: `Something went wrong. ${
          additionalMessage[0].toUpperCase() + additionalMessage.slice(1)
        }`,
      }
    : { _defaultMapperError: `Something went wrong` };

export const mapCustomAttributesErrors = ({
  errors,
  config,
}: MapperOptions): Errors => {
  try {
    const customAttributesErrors = errors.custom_attributes_values;
    const obj: JSObject = customAttributesErrors
      ? customAttributesErrors[0]
      : {};
    const objKeys = Object.keys(obj);

    if (objKeys.length === 0)
      return unexpectedErrorObject(toErrorsString(errors));

    const result = objKeys.reduce((accumulator, key) => {
      try {
        const keyInConfig = config.find((item) => item.id === key);
        if (!keyInConfig) throw unexpectedErrorObject(JSON.stringify(obj));

        return { ...accumulator, [key]: toErrorsString(obj[key]) };
      } catch (e) {
        return e;
      }
    }, {});
    result._defaultMapperError = "Invalid input data";

    return result;
  } catch (e) {
    return unexpectedErrorObject();
  }
};
