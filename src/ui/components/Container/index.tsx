import React, { useContext, useEffect } from "react";
import styles from "./styles.module.css";
import Name from "../../../types/resources/name";
import classNames from "classnames/bind";
import { usePronunciations } from "../../hooks/pronunciations";
import Loader from "../Loader";
import FullName from "../FullName";
import Logo from "../Logo";
import NameLine from "../NameLine";
import ControllerContext from "../../contexts/controller";

interface Props {
  firstName: Name;
  lastName: Name;
  fullName: Name;
  loading?: boolean;
}

const cx = classNames.bind(styles);

const Container = (props: Props) => {
  const controller = useContext(ControllerContext);
  const { firstName, lastName, fullName } = props;
  const { pronunciations, setPronunciations } = usePronunciations();

  const complexSearch = async () => {
    const existedNames = [firstName, lastName, fullName].filter((n) => n.exist);

    if (existedNames.length === 0) return;

    setPronunciations(await controller.complexSearch(existedNames));
  };

  useEffect(() => {
    complexSearch();
  }, [props.fullName, props.firstName, props.lastName]);

  return (
    <React.Fragment>
      <div className={cx("head-line")}>
        <Logo />

        <FullName>
          <span className={cx({ "name-word--secondary": !firstName.exist })}>
            {`${firstName.key}, `}
          </span>
          <span className={cx({ "name-word--secondary": !lastName.exist })}>
            {lastName.key}
          </span>
        </FullName>
      </div>

      <hr className={styles.divider} />
      {props.loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <NameLine
            pronunciations={pronunciations.firstName}
            name={firstName.key}
            type={firstName.type}
          />

          <NameLine
            pronunciations={pronunciations.lastName}
            name={lastName.key}
            type={lastName.type}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Container;
