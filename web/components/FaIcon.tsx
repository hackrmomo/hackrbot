import { IconName, IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SvgIcon, SvgIconProps } from "@mui/material";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

export const FaIcon = ({ icon, ...rest }: SvgIconProps & { icon: IconProp }) => {
  return <SvgIcon {...rest}>
    <FontAwesomeIcon {...{ icon }} />
  </SvgIcon>
}
