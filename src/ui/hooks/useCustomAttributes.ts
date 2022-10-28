import { useContext, useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import IFrontController from "../../types/front-controller";
import ControllerContext from "../../ui/contexts/controller";
import {
  CustomAttributeObject,
  valueMapperFunc,
} from "../../core/mappers/custom-attributes.map";
import Pronunciation from "../../types/resources/pronunciation";
import { NameOption } from "../../ui/components/FullNamesList";

interface HookProps {
  name: Omit<NameOption, "key">;
  pronunciation: Pronunciation;
  controller?: IFrontController;
  saveCallback?: () => void;
}

const useCustomAttributes = ({
  pronunciation,
  name,
  saveCallback,
  controller = useContext<IFrontController>(ControllerContext),
}: HookProps) => {
  const [inEdit, setInEdit] = useState<boolean>(false);
  const [data, setData] = useState<CustomAttributeObject[]>(
    cloneDeep(pronunciation?.customAttributes) || []
  );

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const config = cloneDeep(controller.customAttributes);

  const customAttrsPresent =
    data?.length > 0 &&
    data.some((e) => e.value && String(e.value).length !== 0);

  const customAttrsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    setData(
      cloneDeep(pronunciation?.customAttributes) as CustomAttributeObject[]
    );
  }, [pronunciation]);

  const saveCustomAttributes = async (): Promise<void> => {
    setLoading(true);

    const data = customAttrsRef.current.data;

    const values = data.reduce((prev, current) => {
      prev[current.id] = valueMapperFunc(current.presentation)(current.value);
      return prev;
    }, {});

    const res = await controller.saveCustomAttributes(values, name.owner);

    if (res.hasErrors) {
      setErrors(res.errors.custom_attributes_values);
      setLoading(false);
      return;
    }

    saveCallback && saveCallback();
    setErrors([]);
    setInEdit(false);

    setLoading(false);
  };

  const exitEditMode = (): void => {
    setInEdit(false);
    setErrors([]);
  };

  const enterEditMode = (): void => setInEdit(true);

  return {
    loading,
    errors,
    data,
    saveCustomAttributes,
    exitEditMode,
    enterEditMode,
    inEdit,
    config,
    customAttrsPresent,
    customAttrsRef,
  };
};

export default useCustomAttributes;
