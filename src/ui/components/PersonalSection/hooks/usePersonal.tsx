import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ControllerContext from "../../../contexts/controller";
import { Editors, usePersonalArgs, usePersonalReturn } from "../types";
import Pronunciation from "../../../../types/resources/pronunciation";
import useFeaturesManager, {
  CanComponents,
  ShowComponents,
} from "../../../hooks/useFeaturesManager";
import { blobToBase64String } from "blob-util";
import { NameTypes } from "../../../../types/resources/name";
import nameToKeyTypeObjectsArray from "../../../../core/utils/name-to-key-type-objects-array";

export const usePersonal = ({
  name,
  owner,
}: usePersonalArgs): usePersonalReturn => {
  const controller = useContext(ControllerContext);
  const { show, can } = useFeaturesManager();

  const { firstName, lastName } = useMemo(() => {
    const names = nameToKeyTypeObjectsArray(name, controller.nameParser).filter(
      (name) => name.type !== NameTypes.FullName
    );
    const firstName = names.find((name) => name.type === NameTypes.FirstName)
      .key;
    const lastName = names.find((name) => name.type === NameTypes.LastName).key;

    return { firstName, lastName };
  }, [name, controller]);

  const [loading, setLoading] = useState<boolean>(false);

  const [pronunciation, setPronunciation] = useState<Pronunciation>(null);
  const [libFNPronun, setLibFNPronun] = useState<Pronunciation>(null);
  const [libLNPronun, setLibLNPronun] = useState<Pronunciation>(null);
  const [tempFNPronun, setTempFNPronun] = useState<Pronunciation>(null);
  const [tempLNPronun, setTempLNPronun] = useState<Pronunciation>(null);

  const [inEdit, setInEdit] = useState<boolean>(false);

  const timeout = useRef<ReturnType<typeof setTimeout>>(null);
  const [currentEditor, setCurrentEditor] = useState<Editors>(null);

  const [recDeleted, setRecDeleted] = useState<boolean>(false);
  const [recBlob, setRecBlob] = useState<Blob>(null);
  const [libDeleted, setLibDeleted] = useState<boolean>(false);
  const [recFailed, setRecFailed] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string>(null);
  const [tempAvatarFile, setTempAvatarFile] = useState<File>(null);
  const [avatarDeleted, setAvatarDeleted] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<string>(null);
  const [showUnsavedTip, setShowUnsavedTip] = useState<boolean>(false);

  const recTouched = recDeleted || !!recBlob;
  const libTouched =
    libDeleted || tempFNPronun !== libFNPronun || tempLNPronun !== libLNPronun;
  const avatarTouched = avatarDeleted || !!tempAvatarFile;
  const touched = recTouched || libTouched || avatarTouched;
  debugger;

  const canSimpleSearch = can(CanComponents.Pronunciation, "index");
  const showPersonalBlock = show(ShowComponents.PersonalBlock);
  const showAvatars = show(ShowComponents.Avatars);
  const canAvatars = can(CanComponents.CanRequestAvatars);
  const showLibraryRecordings = show(ShowComponents.LibraryRecordings);
  const showRecorder = currentEditor === Editors.Recorder;
  const showUploader = currentEditor === Editors.Uploader;
  const showLibraryEditor = currentEditor === Editors.Library;

  // loading BE data
  const simpleSearch = async () => {
    if (!canSimpleSearch) return;

    const fullName = await controller.simpleSearch(
      {
        key: name,
        type: NameTypes.FullName,
      },
      owner
    );
    const fullNamePronun = fullName.find((p) => p.nameOwnerCreated);
    setPronunciation(fullNamePronun);
  };

  const loadPreferredLibRecs = async () => {
    if (!showLibraryRecordings) return;
    if (!canSimpleSearch) return;

    const result = await controller.getPreferredRecordings({
      ownerContext: owner,
    });

    setLibFNPronun(result.firstNamePronunciation);
    setLibLNPronun(result.lastNamePronunciation);

    setTempFNPronun(result.firstNamePronunciation);
    setTempLNPronun(result.lastNamePronunciation);
  };

  const loadAvatar = async () => {
    if (!showAvatars || !canAvatars) return;

    const url = await controller.getAvatar(owner);

    setAvatarUrl(url);
    setTempAvatarUrl(url);
  };

  const load = useCallback(async () => {
    setLoading(true);

    await Promise.all([simpleSearch(), loadPreferredLibRecs(), loadAvatar()])
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [controller, owner, name]);

  const cleanReload = async () => {
    setPronunciation(null);
    setLibFNPronun(null);
    setLibLNPronun(null);
    setTempFNPronun(null);
    setTempLNPronun(null);
    setInEdit(false);
    closeEditors();
    setRecDeleted(false);
    setRecBlob(null);
    setLibDeleted(false);
    setRecFailed(false);
    setAvatarUrl(null);
    setTempAvatarUrl(null);
    setTempAvatarFile(null);
    setAvatarDeleted(null);
    setAvatarError(null);
    setShowUnsavedTip(false);

    await load();
  };

  useEffect(() => {
    load();

    return clearTimeout(timeout.current);
  }, [name, controller, load]);

  // utility
  const openEdit = () => setInEdit(true);
  const closeEditors = () => setCurrentEditor(null);
  const openRecorder = () => {
    setRecFailed(false);
    setCurrentEditor(Editors.Recorder);
  };
  const openLibraryEditor = () => setCurrentEditor(Editors.Library);
  const openUploader = () => setCurrentEditor(Editors.Uploader);

  // Recorder event handlers
  const recOnDelete = () => {
    setRecDeleted(true);
    setRecBlob(null);
  };
  const recOnRecord = ({ blob }) => {
    setRecBlob(blob);
    setRecDeleted(false);
    setLibDeleted(true);
    setTempFNPronun(libFNPronun);
    setTempLNPronun(libLNPronun);
  };
  const recOnFail = () => {
    setRecFailed(true);
    openUploader();
  };

  // Library recordings editor event handlers
  const libOnDelete = () => setLibDeleted(true);
  const libOnFNSelect = (pronun) => {
    setTempFNPronun(pronun);
    setLibDeleted(false);
    setRecDeleted(true);
    setRecBlob(null);
  };
  const libOnLNSelect = (pronun) => {
    setTempLNPronun(pronun);
    setLibDeleted(false);
    setRecDeleted(true);
    setRecBlob(null);
  };

  // Avatar editor event handlers
  const avatarOnUpload = ({ file, url }) => {
    setTempAvatarFile(file);
    setTempAvatarUrl(url);
    setAvatarError(null);
    setAvatarDeleted(false);
  };
  const avatarOnDelete = () => {
    setTempAvatarFile(null);
    setTempAvatarUrl(null);
    setAvatarError(null);
    setAvatarDeleted(true);
  };
  const avatarOnFail = (error: string) => setAvatarError(error);

  // submission
  const onEditClose = () => {
    if (touched && !showUnsavedTip) {
      setShowUnsavedTip(true);
      timeout.current = setTimeout(() => setShowUnsavedTip(false), 3000);
      return;
    }

    setInEdit(false);
  };

  const onEditSave = async () => {
    setLoading(true);

    const requests = [];

    if (showLibraryRecordings) {
      if ((libFNPronun || libLNPronun) && libDeleted)
        requests.push(
          controller.deletePreferredRecordings({
            firstNamePronunciation: libFNPronun,
            lastNamePronunciation: libLNPronun,
          })
        );

      if (libFNPronun !== tempFNPronun || libLNPronun !== tempLNPronun)
        requests.push(
          controller.savePreferredRecordings({
            firstNamePronunciation: tempFNPronun,
            lastNamePronunciation: tempLNPronun,
          })
        );
    }

    if (pronunciation && recDeleted)
      requests.push(
        controller.destroy(
          pronunciation.id,
          pronunciation.sourceType,
          pronunciation.relativeSource
        )
      );

    if (recBlob) {
      requests.push(
        blobToBase64String(recBlob).then((audio) =>
          controller.createRecording(name, NameTypes.FullName, audio, owner)
        )
      );
    }

    if (showAvatars && canAvatars) {
      if (avatarUrl && avatarDeleted) requests.push(controller.deleteAvatar());

      if (tempAvatarFile) {
        const reader = new FileReader();

        requests.push(
          new Promise((resolve) => {
            reader.onload = ({ target }): void => {
              resolve(target.result);
            };
            reader.readAsDataURL(tempAvatarFile);
          })
            .then((fileUrl: string) => controller.saveAvatar(fileUrl, owner))
            .then((url) => setAvatarUrl(url))
        );
      }
    }

    closeEditors();

    return Promise.all(requests)
      .catch((e) => console.log(e))
      .finally(async () => {
        await cleanReload();
        setLoading(false);
      });
  };

  return {
    showPersonalBlock,
    showAvatars,
    canAvatars,
    showLibraryRecordings,
    showRecorder,
    showUploader,
    showLibraryEditor,
    pronunciation,
    libFNPronun,
    libLNPronun,
    tempFNPronun,
    tempLNPronun,
    loading,
    inEdit,
    firstName,
    lastName,
    avatarUrl,
    tempAvatarUrl,
    touched,
    libDeleted,
    recFailed,
    showUnsavedTip,
    tempAvatarFile,
    avatarError,
    openEdit,
    onEditClose,
    onEditSave,
    closeEditors,
    openRecorder,
    openUploader,
    openLibraryEditor,
    recOnDelete,
    recOnRecord,
    recOnFail,
    libOnDelete,
    libOnFNSelect,
    libOnLNSelect,
    avatarOnUpload,
    avatarOnDelete,
    avatarOnFail,
    load,
  };
};
