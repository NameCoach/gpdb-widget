import { useState } from "react";

function useSliderState() {
  const [slider, setSlider] = useState(false);

  const openSlider = () => setSlider(true);

  const closeSlider = () => setSlider(false);

  return [slider, openSlider, closeSlider] as const;
}

export default useSliderState;
