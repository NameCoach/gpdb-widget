import Pronunciation from "../../../../types/resources/pronunciation";
import { Option } from "../../Select";

export const pronunToOption = (pronun: Pronunciation): Option => ({
  value: pronun.id,
  label: pronun.language,
});
