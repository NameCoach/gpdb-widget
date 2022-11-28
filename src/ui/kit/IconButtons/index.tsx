import React from "react";
import Button from "../Button";
import Icons from "../Icons";
import { cloneDeep } from "lodash";
import { IconButtonProps } from "../types";
import { IconProps } from "../Icons/types";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { OpenerRef } from "../Popup/types";

const cx = classNames.bind(styles);

type IconsObjectKeys = keyof typeof Icons;

// TODO: rework this, do we need types here at all?
export type IconButtonFC = ({ref, ...props}: IconButtonProps & { ref?: OpenerRef<HTMLButtonElement> }) => JSX.Element;

type IIconButtonsType = {
  [x in IconsObjectKeys]: IconButtonFC;
};

const GeneratedIconButtons = Object.entries(cloneDeep(Icons)).reduce(
  (acc, [key, value]) => {
    const Component = value as React.FC<IconProps>;

    return {
      ...acc,
      [key]: React.forwardRef<HTMLButtonElement, IconButtonProps>(
        (props, ref): React.ReactElement<IconButtonProps> => {
          const { disabled, iconOptions, className, ...rest } = props;
          return (
            <Button
              ref={ref}
              {...rest}
              className={cx(
                styles.icon_button,
                styles.max_height_24,
                className,
                {
                  disabled: disabled,
                }
              )}
            >
              {Component({
                ...iconOptions,
                className: styles.square,
              })}
            </Button>
          );
        }
      ),
    };
  },
  {} as IIconButtonsType
);

const CustomIconButtons = {
  CloseTooltip: React.forwardRef<HTMLButtonElement, IconButtonProps>(
    (props, ref): React.ReactElement<IconButtonProps> => {
      const { iconOptions, className, ...rest } = props;

      return (
        <Button
          ref={ref}
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
    }
  ),
  Checkbox: React.forwardRef<HTMLButtonElement, IconButtonProps>(
    (props, ref): React.ReactElement<IconButtonProps> => {
      const { iconOptions, className, ...rest } = props;

      return (
        <Button
          ref={ref}
          {...rest}
          className={cx(styles.icon_button, styles.square_20, className)}
        >
          <Icons.Checkbox {...iconOptions} />
        </Button>
      );
    }
  ),
};

const IconButtons = { ...GeneratedIconButtons, ...CustomIconButtons };

export default IconButtons;
