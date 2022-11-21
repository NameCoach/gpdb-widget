import { UserResponse } from "gpdb-api-client";
import { useContext, useState } from "react";
import ControllerContext from "../contexts/controller";

const useUserResponse = ({
  callBack,
  pronunciation,
  owner,
  controller = useContext(ControllerContext),
}) => {
  const [loading, setLoading] = useState(false);

  const onUserResponse = async (): Promise<void> => {
    setLoading(true);
    const response =
      pronunciation?.userResponse?.response === UserResponse.Save
        ? UserResponse.NoOpinion
        : UserResponse.Save;

    await controller.createUserResponse(pronunciation.id, response, owner);

    callBack && callBack();

    setLoading(false);
  };

  return { loading, onUserResponse };
};

export default useUserResponse;
