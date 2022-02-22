import IFrontController, { Meta } from "../types/front-controller";
import Name, { NameTypes } from "../types/resources/name";
import {
  Client as GpdbClient,
  NameOwner,
  PermissionsManager,
  Resources,
  Target,
  TargetTypeSig,
  User,
  UserResponse,
} from "gpdb-api-client";
import Pronunciation, { AudioSource } from "../types/resources/pronunciation";
import pronunciationMap from "./mappers/pronunciation.map";
import { AnalyticsEventType } from "../types/resources/analytics-event-type";
import NamesApi from "./api/names.api";
import NameTypesFactory from "../types/name-types-factory";
import NameParser from "../types/name-parser";
import DefaultNameParser from "./parsers/default-name-parser";
import { loadParams } from "gpdb-api-client/build/main/types/repositories/permissions";
import customAttributesMap, {
  CustomAttributeObject,
} from "./mappers/custom-attributes.map";

// TODO: provide error handling and nullable responses

export default class FrontController implements IFrontController {
  public permissions: PermissionsManager;
  public customAttributes: CustomAttributeObject[];

  constructor(
    private readonly apiClient: GpdbClient,
    public nameOwnerContext: NameOwner,
    public userContext: User,
    public nameParser: NameParser = new DefaultNameParser(),
    private readonly namesApi: NamesApi = new NamesApi()
  ) {}

  async complexSearch(
    names: Array<Name>,
    nameOwner?: NameOwner,
    meta?: Meta
  ): Promise<{ [t in NameTypes]: Pronunciation[] }> {
    const owner = nameOwner || this.nameOwnerContext;

    const targets: Target[] = names.map((name) => ({
      target: name.key,
      targetTypeSig: NameTypesFactory[name.type],
      targetOwnerContext: owner,
    }));

    const response = await this.apiClient.pronunciations.complexSearch({
      targets,
      userContext: this.userContext,
    });

    return this.resultByTargets(names, response.target_results, owner);
  }

  async simpleSearch(
    name: Omit<Name, "exist">,
    nameOwner?: NameOwner
  ): Promise<Pronunciation[]> {
    const owner = nameOwner || this.nameOwnerContext;

    const {
      target_result: { pronunciations },
    }: any = await this.apiClient.pronunciations.simpleSearch({
      target: name.key,
      targetOwnerSig: owner.signature,
      targetTypeSig: NameTypesFactory[name.type],
      target_owner_email: owner?.email,
      user_sig: this.userContext.signature,
    });

    return pronunciations.map((p) => {
      const nameOwnerCreated =
        p.audio_source === AudioSource.NameOwner &&
        p.name_owner_signature === owner.signature;

      if (
        nameOwnerCreated &&
        owner.signature === this.userContext.signature &&
        p.custom_attributes?.length > 0 &&
        !this.permissions.can(Resources.Pronunciation, "index:hedb") &&
        !this.permissions.can(Resources.Pronunciation, "index:name_badge")
      ) {
        this.customAttributes = customAttributesMap(p.custom_attributes);
      }

      const isHedb = /hedb_/.test(p.id);

      return pronunciationMap({ ...p, nameOwnerCreated, isHedb });
    });
  }

  async searchBySig(nameOwner?: NameOwner, meta?: Meta): Promise<any> {
    const owner = nameOwner || this.nameOwnerContext;

    const { target_results } = await this.apiClient.pronunciations.searchBySig({
      targetOwnerContext: owner,
      userContext: this.userContext,
    });

    const names = target_results.map((target) => ({
      key: target.target_origin,
    }));

    const result = this.resultByTargets(names, target_results, owner);

    await this.sendAnalytics(AnalyticsEventType.Available, names, meta?.uri);

    return [names, result];
  }

  createRecording(
    name: string,
    type: NameTypes,
    audio: string,
    nameOwner?: NameOwner
  ): Promise<any> {
    const owner = nameOwner || this.nameOwnerContext;

    return this.apiClient.pronunciations.createRecording({
      target: name,
      targetTypeSig: NameTypesFactory[type],
      audioBase64: audio,
      userContext: this.userContext,
      nameOwnerContext: owner,
    });
  }

  createUserResponse(
    id: string,
    type: UserResponse,
    nameOwner?: NameOwner
  ): PromiseLike<void> {
    const ownerSig = nameOwner?.signature || this.nameOwnerContext.signature;

    return this.apiClient.pronunciations.userResponse({
      recordingId: id,
      userResponse: type,
      targetOwnerSig: ownerSig,
      userContext: this.userContext,
    });
  }

  requestRecording(
    name: string,
    type: NameTypes,
    nameOwner?: NameOwner
  ): PromiseLike<void> {
    const owner = nameOwner || this.nameOwnerContext;

    return this.apiClient.pronunciations.createRecordingRequest({
      target: name,
      targetTypeSig: NameTypesFactory[type],
      targetOwnerContext: owner,
      userContext: this.userContext,
    });
  }

  async findRecordingRequest(
    name: string,
    type: NameTypes,
    nameOwner?: NameOwner
  ): Promise<boolean> {
    const owner = nameOwner || this.nameOwnerContext;

    try {
      await this.apiClient.pronunciations.findRecordingRequest({
        target: name,
        targetTypeSig: NameTypesFactory[type],
        targetOwnerContext: owner,
        userContext: this.userContext,
      });

      return true;
    } catch (error) {
      if (!error.message.includes("Not Found")) console.error(error);

      return false;
    }
  }

  async saveCustomAttributes(
    customAttributesValues: { [x: string]: string | boolean },
    nameOwner?: NameOwner
  ): Promise<boolean> {
    const owner = nameOwner || this.nameOwnerContext;

    try {
      await this.apiClient.customAttributes.saveValues({
        userContext: this.userContext,
        targetOwnerContext: owner,
        customAttributesValues,
      });
    } catch (error) {
      if (!error.message.includes("Not Found")) console.error(error);
      return false;
    }

    return true;
  }

  async sendAnalytics(
    eventType: string,
    message: string | object | boolean,
    recordingId?: string,
    rootUrl?: string,
    toolSignature?: string
  ): Promise<void> {
    try {
      await this.apiClient.analyticsEvents.create({
        entityId: this.nameOwnerContext.signature,
        customerId: this.userContext.email || "anonymous",
        entityType: "browser_extension_user",
        rootUrl: rootUrl || "emptyUrl",
        eventType,
        recordingId,
        message:
          typeof message === "object"
            ? JSON.stringify(message)
            : String(message),
        userId: this.nameOwnerContext.signature,
        toolSignature: toolSignature || "gpdb_widget",
        versionInfo: {},
      });
    } catch (e) {
      console.log(`sendAnalytics error: ${e}`);
    }
  }

  async verifyNames(name: string): Promise<any> {
    const trimmedName = name.trim();
    const { firstName, lastName, fullName } = this.nameParser.parse(
      trimmedName
    );
    const foundNames = await this.namesApi.searchNames(
      fullName,
      this.apiClient.application.instanceSig
    );
    const { allNames, fullName: foundFullName } = foundNames;

    const isNamePartExist = (n: string): boolean =>
      !!allNames.find((foundName) =>
        new RegExp(`\\b${foundName}\\b`, "i").test(n)
      );

    if (!(firstName || lastName)) {
      return {
        [NameTypes.FirstName]: {
          key: fullName,
          type: NameTypes.FirstName,
          exist: isNamePartExist(fullName),
        },
        [NameTypes.LastName]: {
          key: lastName,
          type: NameTypes.LastName,
          exist: isNamePartExist(lastName),
        },
        [NameTypes.FullName]: {
          key: null,
          type: NameTypes.FullName,
          exist: false,
        },
      };
    }

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
        key: fullName,
        type: NameTypes.FullName,
        exist: fullName
          .split(" ")
          .every((n) => foundFullName.includes(n.toLowerCase())),
      },
    };

    return result;
  }

  async loadPermissions(rest?: loadParams): Promise<void> {
    this.permissions = await this.apiClient.permissions.load(rest);

    return Promise.resolve();
  }

  async loadCustomAttributesConfig(): Promise<void> {
    if (this.permissions.can(Resources.CustomAttributes, "retrieve_config")) {
      try {
        const result = await this.apiClient.customAttributes.retrieveConfig();
        this.customAttributes = customAttributesMap(result.data);
      } catch (error) {
        if (!error.message.includes("Not Found")) console.error(error);
        this.customAttributes = [] as CustomAttributeObject[];
      }
    } else {
      this.customAttributes = [] as CustomAttributeObject[];
    }

    return Promise.resolve();
  }

  // TODO NAM-159 implement saving to and loading from localStorageor or get rid of this methods
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async saveAudioSampleRate(): Promise<void> {}

  async loadAudioSampleRate(): Promise<number> {
    return 1;
  }

  resultByTargets(names, target_results, owner): any {
    const result: { [t in NameTypes]: Pronunciation[] } = {
      [NameTypes.FirstName]: [],
      [NameTypes.LastName]: [],
      [NameTypes.FullName]: [],
    };
    names.forEach((name) => {
      const target = target_results.find(
        (res) => res.target_origin === name.key
      );
      const pronunciations: Pronunciation[] = target.pronunciations
        .map((pronunciation) => {
          if (
            result[NameTypes.FullName].length === 0 &&
            pronunciation.target_type_sig === TargetTypeSig.FullName
          ) {
            const nameOwnerCreated =
              pronunciation.audio_source === AudioSource.NameOwner &&
              pronunciation.name_owner_signature === owner.signature;

            if (
              nameOwnerCreated &&
              owner.signature === this.userContext.signature &&
              pronunciation.custom_attributes?.length > 0 &&
              !this.permissions.can(Resources.Pronunciation, "search:hedb") &&
              !this.permissions.can(
                Resources.Pronunciation,
                "search:name_badge"
              )
            ) {
              this.customAttributes = customAttributesMap(
                pronunciation.custom_attributes
              );
            }

            const isHedb = /hedb_/.test(pronunciation.id);

            if (!name.type) {
              name.type = NameTypes.FullName;
            }
            return pronunciationMap({
              ...pronunciation,
              nameOwnerCreated,
              isHedb,
            });
          }
          if (!name.type) {
            TargetTypeSig.FirstName === pronunciation.target_type_sig
              ? (name.type = NameTypes.FirstName)
              : (name.type = NameTypes.LastName);
          }
          return pronunciationMap(pronunciation);
        })
        .filter(Boolean);

      result[name.type] = pronunciations;
    });

    return result;
  }
}
