import md5 from "md5";

const generateTooltipId = (componentName: string): string => {
  return componentName + "_" + md5(Date.now().toString());
};

export default generateTooltipId;
