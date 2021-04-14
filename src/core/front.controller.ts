import IFrontController, { Meta } from '../types/front-controller'
import Name, { NameTypes } from '../types/resources/name'
import { UserResponseTypes } from '../types/resources/user-response'
import Pronunciation, { AudioSource } from '../types/resources/pronunciation'
import { Client as GpdbClient } from 'gpdb-api-client'

/*
TODO:
  1 - configure better types export in gpdb-api-client
  2 - provide error handling and nullable responses
*/

import NameOwner from 'gpdb-api-client/build/main/types/input/name-owner'
import User from 'gpdb-api-client/build/main/types/input/user'
import Target from 'gpdb-api-client/build/main/types/input/tasrget'
import { TargetTypeSig } from 'gpdb-api-client/build/main/types/input/enum-types'

import pronunciationMap from './mappers/pronunciation.map'
import { AnalyticsEventType } from '../types/resources/analytics-event-type'
import NamesApi from './api/names.api'

const NameTypesFactory = {
  [NameTypes.FirstName]: TargetTypeSig.FirstName,
  [NameTypes.LastName]: TargetTypeSig.LastName,
  [NameTypes.FullName]: TargetTypeSig.FirstName
}

export default class FrontController implements IFrontController {
  constructor(
    private readonly apiClient: GpdbClient,
    private readonly nameOwnerContext: NameOwner,
    private readonly userContext: User,
    private readonly namesApi: NamesApi = new NamesApi()
  ) {}

  async complexSearch(names: Array<Name>, meta?: Meta) {
    let result: { [t in NameTypes]: Pronunciation[] }

    const targets: Target[] = names.map(name => ({
      target: name.key,
      targetTypeSig: NameTypesFactory[name.type],
      targetOwnerContext: this.nameOwnerContext,
    }))

    const { target_results }: any = await this.apiClient.pronunciations.complexSearch({
      targets,
      userContext: this.userContext
    })

    names.forEach(name => {
      const target = target_results.find(res => res.target_origin === name.key)
      const pronunciations: Pronunciation[] = target.pronunciations.map(pronunciation => {
        if (!result[NameTypes.FullName] && pronunciation.target_type_sig === TargetTypeSig.FullName) {
          const nameOwnerCreated = pronunciation.audio_source === AudioSource.NameOwner
            && pronunciation.name_owner_signature === this.nameOwnerContext.signature;

          result[NameTypes.FullName] = [pronunciationMap({ ...pronunciation, nameOwnerCreated})];
          return;
        }
        return pronunciationMap(pronunciation)
      }).filter(Boolean)

      return result[name.type] = pronunciations
    })

    try {
      await this.sendAnalytics(AnalyticsEventType.Available, names, meta.uri)
    }
    catch (e) { console.error(e) }

    return result
  }

  async simpleSearch(name: Name, meta?: Meta) {
    const { target_results: { pronunciations }}: any = await this.apiClient.pronunciations.simpleSearch({
      target: name.key,
      targetOwnerSig: this.nameOwnerContext.signature,
      targetTypeSig: NameTypesFactory[name.type]
    })

    return pronunciations.map(pronunciationMap)
  }

  createRecording(name: string, type: NameTypes, audio: string) {
    return Promise.resolve(undefined);
  }

  createUserResponse(id: string, type: UserResponseTypes): PromiseLike<void> {
    return Promise.resolve(undefined);
  }

  requestRecording(name: string, type: NameTypes): PromiseLike<void> {
    return Promise.resolve(undefined);
  }

  async sendAnalytics(
    eventType: string,
    message: string | object | boolean,
    rootUrl?: string,
    recordingId?: string
  ) {
    await this.apiClient.analyticsEvents.create({
      entityId: this.nameOwnerContext.signature,
      customerId: this.userContext.email || "anonymous",
      entityType: "browser_extension_user",
      rootUrl,
      eventType,
      recordingId,
      message:  typeof message === 'object' ? JSON.stringify(message) : String(message),
      userId: this.nameOwnerContext.signature,
      toolSignature: "gpdb-widget",
    });

    return
  }

  async verifyNames(name: string) {
    // TODO: should get application signature from GPDB client
    const foundNames = await this.namesApi.searchNames(name, name);
    const { allNames, fullName } = foundNames;
    const parsedName = name.split(' ');

    const isNamePartExist = n => !!allNames.find(n => new RegExp(`\\b${ n }\\b`, "i").test(n))

    const firstName = parsedName.slice(0, -1).join(" ").trim()
    const lastName = parsedName[parsedName.length - 1]

    return {
      [NameTypes.FirstName]: {
        key: firstName,
        type: NameTypes.FirstName,
        exist: isNamePartExist(firstName)
      },
      [NameTypes.LastName]: {
        key: lastName,
        type: NameTypes.LastName,
        exist: isNamePartExist(lastName)
      },
      [NameTypes.FullName]: {
        key: name,
        type: NameTypes.FullName,
        exist: parsedName.every(n => fullName.includes(n.toLowerCase()))
      }
    }
  }
}
