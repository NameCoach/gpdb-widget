export interface IconBasicProps extends React.SVGAttributes<SVGElement> {
  style?: React.CSSProperties;
  className?: string;
}

export interface PlayableIconProps extends IconBasicProps {
  playing?: boolean;
}

export interface SavedIconProps extends IconBasicProps {
  saved?: boolean;
}

export interface CheckBoxIconProps extends IconBasicProps {
  checked?: boolean;
  error?: boolean;
}

export interface ShevronIconProps extends IconBasicProps {
  up?: boolean;
}

export type IconProps = IconBasicProps &
  PlayableIconProps &
  SavedIconProps &
  CheckBoxIconProps &
  ShevronIconProps;
