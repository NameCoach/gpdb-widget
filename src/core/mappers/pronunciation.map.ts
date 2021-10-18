import Pronunciation from "../../types/resources/pronunciation";

const pronunciationMap: Mapper<Pronunciation> = (raw) => ({
  id: raw.id,
  audioSrc: raw.audio_url,
  nameOwnerCreated: raw.nameOwnerCreated,
  language:
    raw.language_metadata?.origin_language?.[0]?.language ||
    raw.language_metadata?.speaker_language,
  phoneticSpelling: raw.phonetic_transcriptions[0]?.phonetic_transcription,
  userResponse: {
    id: raw.user_responses?.[0]?.response_id,
    response: raw.user_responses?.[0]?.user_response,
  },
});

export default pronunciationMap;
