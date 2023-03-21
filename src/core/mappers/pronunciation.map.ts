import Pronunciation, {
  AudioSource,
  RelativeSource,
} from "../../types/resources/pronunciation";
import customAttributesMap from "./custom-attributes.map";

const isHedb = (id): boolean => {
  return /hedb_/.test(id);
};

const pronunciationMap: Mapper<Pronunciation> = (raw) => ({
  id: raw.id,
  sourceType: raw.source_type,
  audioSrc: raw.audio_url,
  nameOwnerCreated:
    raw.relative_source === RelativeSource.RequesterSelf ||
    raw.relative_source === RelativeSource.TargetSelf,
  relativeSource: raw.relative_source,
  selfRecorded:
    raw.relative_source === RelativeSource.RequesterPeer ||
    raw.relative_source === RelativeSource.RequesterSelf,
  isHedb: isHedb(raw.id),
  userCreated: raw.audio_source === AudioSource.NameUser,
  gpdbCreated: raw.audio_source === AudioSource.Gpdb,
  audioCreator: raw.audio_source,
  language:
    raw.language_metadata?.origin_language?.[0]?.language ||
    raw.language_metadata?.speaker_language,
  phoneticSpelling: raw.phonetic_transcriptions?.[0]?.phonetic_transcription,
  userResponse: {
    id: raw.user_responses?.[0]?.response_id,
    response: raw.user_responses?.[0]?.user_response,
  },
  nameBadgeLink: raw.name_badge_link,
  customAttributes: customAttributesMap(raw.custom_attributes),
  phoneticTranscriptions:
    (raw.phonetic_transcriptions &&
      raw.phonetic_transcriptions.map((transcriptions) => ({
        phoneticTranscription: transcriptions.phonetic_transcription,
        phoneticsSystemSig: transcriptions.phonetics_system_sig,
        workerSignature: transcriptions.worker_signature,
        discussPhonetics: transcriptions.discuss_phonetics,
        createdAt: new Date(transcriptions.created_at),
      }))) ||
    [],
});

export default pronunciationMap;
