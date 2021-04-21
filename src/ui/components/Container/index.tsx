import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Name, { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import { useName } from "../../hooks/names";
import Loader from "../Loader";
import FullName from "../FullName";
import Logo from "../Logo";

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
    </React.Fragment>
  );
};

export default Container;
