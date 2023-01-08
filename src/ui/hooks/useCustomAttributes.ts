import React, { useContext, useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import IFrontController from "../../types/front-controller";
import ControllerContext from "../../ui/contexts/controller";
import { valueMapperFunc } from "../../core/mappers/custom-attributes.map";
import { CustomAttributeObject } from "../../types/resources/custom-attribute";
import Pronunciation from "../../types/resources/pronunciation";
import { NameOwner } from "gpdb-api-client";

interface HookProps {
  owner: NameOwner;
  pronunciation: Pronunciation;
  controller?: IFrontController;
  saveCallback?: () => void;
}

interface HookReturn {
  loading: boolean;
  errors: any[]; // TODO: provide proper type
  data: CustomAttributeObject[];
  saveCustomAttributes: () => Promise<void>;
  exitEditMode: () => void;
  enterEditMode: () => void;
  inEdit: boolean;
  config: CustomAttributeObject[];
  customAttrsPresent: boolean;
  customAttrsRef: React.MutableRefObject<Record<string, any>>;
}

const useCustomAttributes = ({
  pronunciation,
  owner,
  saveCallback,
  controller = useContext<IFrontController>(ControllerContext),
}: HookProps): HookReturn => {
  const [inEdit, setInEdit] = useState<boolean>(false);
  const [isUnsavedChanges, setIsUnsavedChanges] = useState<boolean>(false);
  const [data, setData] = useState<CustomAttributeObject[]>(
    cloneDeep(pronunciation?.customAttributes) || []
  );

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const config: CustomAttributeObject[] = cloneDeep(
    controller.customAttributes
  );

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

    const res = await controller.saveCustomAttributes(values, owner);

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

  const makeChanges = (value: boolean): void => setIsUnsavedChanges(value);

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
    makeChanges,
    isUnsavedChanges,
  };
};

export default useCustomAttributes;
