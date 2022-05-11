/* URLs */
export const EXTENSION_BACKEND_API_URL =
  process.env.NODE_ENV === "development"
    ? "https://ext-api-staging.name-coach.com"
    : "https://ext-api.name-coach.com";
export const GPDB_API_URL =
  process.env.NODE_ENV === "development"
    ? "https://gpdb-staging.name-coach.com/api/public/v1"
    : "https://gpdb.name-coach.com/api/public/v1";
export const ANALYTICS_API_URL =
  process.env.NODE_ENV === "development"
    ? "https://analytics-api-staging.name-coach.com/api/v1"
    : "https://analytics-api.name-coach.com/api/v1";

// text
export const SEARCH_BOX_TIP =
  "Input the name you want to find pronunciation for. You can also find the name and its pronunciation by providing an email. If you want to find a fullname, please use whitespace or coma to separate the name parts.";

export const SAVE_PITCH_TIP =
  "Pitch settings changes do not effect already recorded pronunciation.<br>Please, re-record your pronunciation to apply the new settings.";

export const DEFAULT_NAME_OWNER = "outlook-app";

export const TOOLTIP_DELAY = 1000;
export const RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY = 5000;
