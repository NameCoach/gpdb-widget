import IFrontController, { Meta } from "../types/front-controller";
import Name, { NameTypes } from "../types/resources/name";
import {
  UserResponse,
  Client as GpdbClient,
  NameOwner,
  User,
  Target,
  TargetTypeSig,
} from "gpdb-api-client";
import Pronunciation, { AudioSource } from "../types/resources/pronunciation";
import pronunciationMap from "./mappers/pronunciation.map";
import { AnalyticsEventType } from "../types/resources/analytics-event-type";
import NamesApi from "./api/names.api";
import NameTypesFactory from "../types/name-types-factory";

// TODO: provide error handling and nullable responses

export default class FrontController implements IFrontController {
  constructor(
    private readonly apiClient: GpdbClient,
    private readonly nameOwnerContext: NameOwner,
    private readonly userContext: User,
    private readonly namesApi: NamesApi = new NamesApi()
  ) {}

  async complexSearch(names: Array<Name>, meta?: Meta) {
    const result: { [t in NameTypes]: Pronunciation[] } = {
      [NameTypes.FirstName]: [],
      [NameTypes.LastName]: [],
      [NameTypes.FullName]: [],
    };

    const targets: Target[] = names.map((name) => ({
      target: name.key,
      targetTypeSig: NameTypesFactory[name.type],
      targetOwnerContext: this.nameOwnerContext,
    }));

    const response: any = await this.apiClient.pronunciations.complexSearch({
      targets,
      userContext: this.userContext,
    });

    names.forEach((name) => {
      const target = response.target_results.find(
        (res) => res.target_origin === name.key
      );
      const pronunciations: Pronunciation[] = target.pronunciations
        .map((pronunciation) => {
          if (
            !result[NameTypes.FullName] &&
            pronunciation.target_type_sig === TargetTypeSig.FullName
          ) {
            const nameOwnerCreated =
              pronunciation.audio_source === AudioSource.NameOwner &&
              pronunciation.name_owner_signature ===
                this.nameOwnerContext.signature;

            result[NameTypes.FullName] = [
              pronunciationMap({ ...pronunciation, nameOwnerCreated }),
            ];
            return;
          }
          return pronunciationMap(pronunciation);
        })
        .filter(Boolean);

      result[name.type] = pronunciations;
    });

    try {
      await this.sendAnalytics(AnalyticsEventType.Available, names, meta?.uri);
    } catch (e) {
      console.error(e);
    }

    return result;
  }

  async simpleSearch(name: Name, meta?: Meta) {
    const {
      target_result: { pronunciations },
    }: any = await this.apiClient.pronunciations.simpleSearch({
      target: name.key,
      targetOwnerSig: this.nameOwnerContext.signature,
      targetTypeSig: NameTypesFactory[name.type],
    });

    return pronunciations.map(pronunciationMap);
  }

  createRecording(name: string, type: NameTypes, audio: string) {
    return Promise.resolve(undefined);
  }

  createUserResponse(id: string, type: UserResponse): PromiseLike<void> {
    return this.apiClient.pronunciations.userResponse({
      recordingId: id,
      userResponse: type,
      targetOwnerSig: this.nameOwnerContext.signature,
      userContext: this.userContext,
    });
  }

  requestRecording(name: string, type: NameTypes): PromiseLike<void> {
    return Promise.resolve(undefined);
  }

  async sendAnalytics(
    eventType: string,
    message: string | object | boolean,
    recordingId?: string,
    rootUrl?: string
  ) {
    await this.apiClient.analyticsEvents.create({
      entityId: this.nameOwnerContext.signature,
      customerId: this.userContext.email || "anonymous",
      entityType: "browser_extension_user",
      rootUrl,
      eventType,
      recordingId,
      message:
        typeof message === "object" ? JSON.stringify(message) : String(message),
      userId: this.nameOwnerContext.signature,
      toolSignature: "gpdb-widget",
    });
  }

  async verifyNames(name: string) {
    const foundNames = await this.namesApi.searchNames(
      name,
      this.apiClient.application.instanceSig
    );
    const { allNames, fullName } = foundNames;
    const parsedName = name.split(" ");

    const isNamePartExist = (n) =>
      !!allNames.find((foundName) =>
        new RegExp(`\\b${foundName}\\b`, "i").test(n)
      );

    const firstName = parsedName.slice(0, -1).join(" ").trim();
    const lastName = parsedName[parsedName.length - 1];

    const result = {
      [NameTypes.FirstName]: {
        key: firstName,
        type: NameTypes.FirstName,
        exist: isNamePartExist(firstName),
      },
      [NameTypes.LastName]: {
        key: lastName,
        type: NameTypes.LastName,
        exist: isNamePartExist(lastName),
      },
      [NameTypes.FullName]: {
        key: name,
        type: NameTypes.FullName,
        exist: parsedName.every((n) => fullName.includes(n.toLowerCase())),
      },
    };

    return result;
  }
}
