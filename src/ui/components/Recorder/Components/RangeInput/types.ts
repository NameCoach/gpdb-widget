export interface RangeInputProps {
  min: number;
  max: number;
  values: number[];
  onChange: (value?: any) => void;
  onDefaultClicked: (value?: any) => void;
}
