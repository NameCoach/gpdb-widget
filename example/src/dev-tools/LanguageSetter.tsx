import React, { useContext } from 'react'
import { ControllerContext, SupportedLanguages, useTranslator } from "gpdb-widget";

const style = {
 marginTop: "10px",
 marginBottom: "10px",
 display: "flex",
 justifyContent: "center"
};

const LanguageSetter = () => {
  const controller = useContext(ControllerContext);
  const { setLanguage } = useTranslator(controller);

  const languagesArray = Object.keys(SupportedLanguages).map((key) => SupportedLanguages[key]);

  return (
    <div style={style}>
      {languagesArray.map((language, index) => {
        return <button key={index} onClick={() => setLanguage(language)}>{language}</button>
      })}
    </div>
  )
}

export default LanguageSetter;
