import React from "react";
import Button from "../Button";
import Icons from "../Icons";
import { cloneDeep } from "lodash";
import { IconButtonProps } from "../types";
import { IconProps } from "../Icons/types";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type IconsObjectKeys = keyof typeof Icons;

type IIconButtonsType = {
  [x in IconsObjectKeys]: React.FC<IconButtonProps>;
};

const GeneratedIconButtons = Object.entries(cloneDeep(Icons)).reduce(
  (acc, [key, value]) => {
    const Component = value as React.FC<IconProps>;

    return {
      ...acc,
      [key]: (props: IconButtonProps): React.ReactElement<IconButtonProps> => {
        const { disabled, iconOptions, className, ...rest } = props;

        return (
          <Button
            {...rest}
            className={cx(styles.icon_button, styles.max_height_24, className, {
              disabled: disabled,
            })}
          >
            {Component({
              ...iconOptions,
              className: styles.square,
            })}
          </Button>
        );
      },
    };
  },
  {} as IIconButtonsType
);

const CustomIconButtons = {
  CloseTooltip: (
    props: IconButtonProps
  ): React.ReactElement<IconButtonProps> => {
    const { iconOptions, className, ...rest } = props;

    return (
      <Button
        {...rest}
        className={cx(
          styles.icon_button,
          styles.modal,
          styles.no_background,
          className
        )}
      >
        <Icons.CloseTooltip {...iconOptions} />
      </Button>
    );
  },
  Checkbox: (props: IconButtonProps): React.ReactElement<IconButtonProps> => {
    const { iconOptions, className, ...rest } = props;

    return (
      <Button
        {...rest}
        className={cx(styles.icon_button, styles.square_20, className)}
      >
        <Icons.Checkbox {...iconOptions} />
      </Button>
    );
  },
};

const IconButtons = { ...GeneratedIconButtons, ...CustomIconButtons };

export default IconButtons;
