/* URLs */
export const EXTENSION_BACKEND_API_URL =
  process.env.NODE_ENV === "development"
    ? "https://ext-api-beta.name-coach.com"
    : "https://ext-api.name-coach.com";
export const GPDB_API_URL =
  process.env.NODE_ENV === "development"
    ? "https://gpdb-beta.name-coach.com/api/public/v1"
    : "https://gpdb.name-coach.com/api/public/v1";
export const ANALYTICS_API_URL =
  process.env.NODE_ENV === "development"
    ? "https://analytics-api-staging.name-coach.com/api/v1"
    : "https://analytics-api.name-coach.com/api/v1";

// text
export const SEARCH_BOX_TIP =
  "Input the name you want to find pronunciation for. You can also find the name and its pronunciation by providing an email. If you want to find a fullname, please use whitespace or coma to separate the name parts.";

export const DEVICES_CHANGED_MESSAGE =
  "The configuration of your media devices has changed. Please relaunch the NameCoach add-in in order to avoid issues with recording.";

export const DEFAULT_NAME_OWNER = "outlook-app";

export const TOOLTIP_DELAY = 1000;
export const RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY = 5000;

// ModalTooltip
export const TOOLTIP_SHOW_DELAY = 350;
export const TOOLTIP_HIDE_DELAY = 350;
export const TOOLTIP_MARGIN = 7;
export const TOOLTIP_AUTOCLOSE_DELAY = 1000;

// SearchWidget
export const MIN_INPUT_SYMBOLS_TO_SUGGEST = 3;
export const SUGGESTIONS_ALLOWED_COUNT = 3;
export const NAME_PARTS_MAX_ALLOWED_COUNT = 5;
