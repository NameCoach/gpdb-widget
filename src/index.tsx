// COMPONENTS
import Widget from "./ui/components/Widget";
import ExtensionWidget from "./ui/components/ExtensionWidget";
import PronunciationMyInfoWidget from "./ui/components/PronunciationMyInfoWidget";
import Loader from "./ui/components/Loader";
import FullNamesList from "./ui/components/FullNamesList";
import Recorder from "./ui/components/Recorder";
import PersonalBlock from "./ui/components/deprecated/PersonalBlock";
import PronunciationsBlock from "./ui/components/PronunciationsBlock";
import Player from "./ui/components/Player";
import SearchWidget from "./ui/components/SearchWidget";
import InfoWidget from "./ui/components/InfoWidget/InfoWidget";
import Notification from "./ui/components/Notification";
import ChangeableText from "./ui/kit/ChangableText";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconButtons from "./ui/kit/IconButtons";
import Icons from "./ui/kit/Icons";
import Gap from "./ui/kit/Gap";
import Tooltip from "./ui/kit/Tooltip";
import Popup from "./ui/kit/Popup";
import * as PopupComponents from "./ui/kit/Popup/components";
import { DeviceChangedModal } from "./ui/components/DeviceChangedModal";

// TYPES
import type IFrontController from "./types/front-controller";
import { AnalyticsEventType } from "./types/resources/analytics-event-type";

// LOADER
import loadExtensionClient from "./core/loadExtensionClient";

// INTERFACES
import NameParser, { NPResult } from "./types/name-parser";
import { Configuration } from "gpdb-api-client";
import IStyleContext, { Theme } from "./types/style-context";
import ISystemContext from "./types/system-context";
import ITooltipAction, { TooltipActionType } from "./types/tooltip-action";

// CONTEXTS
import ControllerContext from "./ui/contexts/controller";
import StyleContext from "./ui/contexts/style";
import SystemContext from "./ui/contexts/system";

// HOOKS
import loadClient from "./ui/hooks/loadClient";
import { NotificationsProvider } from "./ui/hooks/useNotification";
import addOnDeviceChangeHandler from "./ui/hooks/addOnDeviceChangeHandler";
import useTranslator from "./ui/hooks/useTranslator";
import useTooltip from "./ui/kit/Tooltip/hooks/useTooltip";
import usePopup from "./ui/kit/Popup/hooks/usePopup";

// UTILS
import SupportedLanguages from "./translations/supported-languages";
import UserAgentManager from "./core/userAgentManager";
import { NameTypes } from "./types/resources/name";

import Analytics from "./analytics";

export {
  Widget,
  ExtensionWidget,
  PronunciationMyInfoWidget,
  PersonalBlock,
  PronunciationsBlock,
  Recorder,
  Player,
  loadClient,
  Configuration,
  Loader,
  FullNamesList,
  ControllerContext,
  StyleContext,
  Theme,
  SystemContext,
  IFrontController,
  IStyleContext,
  ISystemContext,
  loadExtensionClient,
  NPResult,
  NameParser,
  SearchWidget,
  InfoWidget,
  AnalyticsEventType,
  NotificationsProvider,
  Notification,
  addOnDeviceChangeHandler,
  ITooltipAction,
  IconButtons,
  Icons,
  CopyToClipboard,
  ChangeableText,
  TooltipActionType,
  useTranslator,
  SupportedLanguages,
  UserAgentManager,
  Gap,
  Tooltip,
  Popup,
  useTooltip,
  usePopup,
  PopupComponents,
  DeviceChangedModal,
  NameTypes,
  Analytics,
};
