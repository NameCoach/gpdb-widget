import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Name, { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import { useName } from "../../hooks/names";
import Loader from "../Loader";
import FullName from "../FullName";
import Logo from "../Logo";
import Player from "../Player";

type NameProp = Omit<Name, "type">;

interface Props {
  firstName: NameProp;
  lastName: NameProp;
  fullName: NameProp;
  loading?: boolean;
}

const cx = classNames.bind(styles);

const Container = (props: Props) => {
  const { name: firstName } = useName(NameTypes.FirstName, props.firstName);
  const { name: lastName } = useName(NameTypes.LastName, props.lastName);
  const { name: fullName } = useName(NameTypes.FullName, props.fullName);

  useEffect(() => {
    // load names
    /*
      const result = await client.complexSearch(names)
      setNames(result)
     */
  }, [props.fullName, props.firstName, props.lastName]);

  return (
    <React.Fragment>
      <div className={cx("head-line")}>
        <Logo />

        <FullName>
          <span className={cx({ "name-word--secondary": firstName.exist })}>
            {`${firstName.key}, `}
          </span>
          <span className={cx({ "name-word--secondary": lastName.exist })}>
            {lastName.key}
          </span>
        </FullName>
      </div>

      <hr className={styles.divider} />
      {props.loading && <Loader />}

      <Player audioSrc="https://nc-library-recordings.s3.us-west-1.amazonaws.com/uploads/recording/s3_location/ffffb72a-14f5-4007-b66d-83cbb665aea2/4401d29689fbc3102242cc9076f3df21.mp3" />
      <Player audioSrc="https://nc-library-recordings.s3.us-west-1.amazonaws.com/uploads/recording/s3_location/ffff2349-0977-42b1-a247-fd7a07b6af74/bce2ed5a48a83450dd0e003b1932d070.mp3" />
    </React.Fragment>
  );
};

export default Container;
