import * as React from "react";
import { SVGProps } from "react";
const Spinner = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    className="mdl-js"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeWidth={3.556}
      d="M20 12a8 8 0 0 1-11.76 7.061"
    />
  </svg>
);
export default Spinner;
