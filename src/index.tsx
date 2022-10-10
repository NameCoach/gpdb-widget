// COMPONENTS
import Widget from "./ui/components/Widget";
import ExtensionWidget from "./ui/components/ExtensionWidget";
import PronunciationMyInfoWidget from "./ui/components/PronunciationMyInfoWidget";
import Loader from "./ui/components/Loader";
import FullNamesList from "./ui/components/FullNamesList";
import Recorder from "./ui/components/Recorder";
import PersonalBlock from "./ui/components/PersonalBlock";
import PronunciationsBlock from "./ui/components/PronunciationsBlock";
import Player from "./ui/components/Player";
import SearchWidget from "./ui/components/SearchWidget";
import InfoWidget from "./ui/components/InfoWidget/InfoWidget";
import Notification from "./ui/components/Notification";
import ModalTooltip from "./ui/components/ModalTooltip";
import HelpAction from "./ui/components/Actions/Help";
import ModalTooltipOption from "./ui/components/ModalTooltip/Option";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ChangeableText from "./ui/components/ModalTooltip/ChangableText";

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
import { PresentationMode as ModalTooltipPresentationMode } from "./types/modal-tooltip";

// CONTEXTS
import ControllerContext from "./ui/contexts/controller";
import StyleContext from "./ui/contexts/style";
import SystemContext from "./ui/contexts/system";

// HOOKS
import loadClient from "./ui/hooks/loadClient";
import { NotificationsProvider } from "./ui/hooks/useNotification";
import addOnDeviceChangeHandler from "./ui/hooks/addOnDeviceChangeHandler";
import useTranslator from "./ui/hooks/useTranslator";

import SupportedLanguages from "./translations/supported-languages";

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
  ModalTooltip,
  ITooltipAction,
  HelpAction,
  ModalTooltipPresentationMode,
  ModalTooltipOption,
  CopyToClipboard,
  ChangeableText,
  TooltipActionType,
  useTranslator,
  SupportedLanguages,
};
