export type Errors = { [x: string]: string };
type JSObject = { [x: string]: any };
type MapperOptions = {
  errors: JSObject;
  config: JSObject;
};

const toErrorsString = (obj): string => {
  const rawString = JSON.stringify(obj);

  return rawString.replace(/\{|\}|\[|\]|"|value|:/gi, "");
};

const unexpectedErrorObject = (
  additionalMessage?: string
): { [x: string]: string } =>
  additionalMessage
    ? { _defaultMapperError: `Something went wrong. ${additionalMessage}` }
    : { _defaultMapperError: `Something went wrong` };

export const mapCustomAttributesErrors = ({
  errors,
  config,
}: MapperOptions): Errors => {
  const obj: JSObject = errors.custom_attributes_values[0] || {};
  const objKeys = Object.keys(obj);

  if (objKeys.length === 0) return unexpectedErrorObject();

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
};
