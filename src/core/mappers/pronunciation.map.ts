import Pronunciation from '../../types/resources/pronunciation'

const pronunciationMap: Mapper<Pronunciation> = raw => ({
  id: raw.id,
  audioSrc: raw.audio_url,
  nameOwnerCreated: raw.id,
  language: raw.language_metadata?.origin_language?.[0]?.language || raw.language_metadata?.speaker_language,
  phoneticSpelling: raw.phonetic_transcriptions[0]?.phonetic_transcription,
})

export default pronunciationMap


