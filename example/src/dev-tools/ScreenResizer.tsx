import React, { useState } from 'react'

const ScreenResizer = () => {
  const defaultChangeValue = 10;
  const [currentChangeValue, setCurrentChangeValue] = useState(defaultChangeValue);

  const changeContainerWidth = (action: string) => {
    const elem = document.body.children[1].children[0] as HTMLElement;
    const currentWidth = parseInt(elem.style.width, 10);

    switch (action) {
      case "+":
        elem.style.width = ( currentWidth + currentChangeValue).toString() + "px";
        break;
      case "-":
        elem.style.width = ( currentWidth - currentChangeValue).toString() + "px";
        break;
    }
  };

  const handleIncreaseWidth = () => changeContainerWidth("+");
  const handleDecreaseWidth = () => changeContainerWidth("-");

  const handleOnChanged = (value: string) => {
    const _value = parseInt(value);
    setCurrentChangeValue(_value);
  };
  
  return (
    <div style={{ display: "flex", margin: "0 30% 20px"}}>
      <input
        type="number"
        defaultValue={defaultChangeValue}
        onChange={(e) => handleOnChanged(e.target.value)}
        required
        style={{ width: "80%", marginLeft: "20px" }}
      />
      <button onClick={handleIncreaseWidth} id="increase_width">+</button>
      <button onClick={handleDecreaseWidth} id="decrease_width">-</button>
    </div>
  );
}

export default ScreenResizer;
