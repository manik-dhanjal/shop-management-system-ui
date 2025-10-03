import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
} from "@mui/material";

interface SwitchProps extends Omit<MuiSwitchProps, "checked"> {
  checked?: boolean;
  label: string;
}

const Switch = ({ label, ...props }: SwitchProps) => {
  return (
    <div>
      <label>{label}</label>
      <MuiSwitch {...props} />
    </div>
  );
};

export default Switch;
