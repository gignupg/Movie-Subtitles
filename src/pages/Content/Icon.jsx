import React from 'react';
import { styled } from '@material-ui/core/styles';

const Svg = styled('svg')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
  width: '100%',
  height: '100%',
  marginLeft: 'calc(-1 * ((100% - 100%) / 2))',
});

function Icon() {
  // return (
  //   <Svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     version="1.1"
  //     viewBox="0 0 36 36"
  //     shape-rendering="geometricPrecision"
  //   >
  //     <path
  //       d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z"
  //       fill="currentColor"
  //     />
  //   </Svg>
  // );
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 36 36"
      shape-rendering="geometricPrecision"
    >
      <path
        d="M11,11 C9.9,11 9,11.9 9,13 L9,23 C9,24.1 9.9,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M11,17 L14,17 L14,19 L11,19 L11,17 L11,17 Z M20,23 L11,23 L11,21 L20,21 L20,23 L20,23 Z M25,23 L22,23 L22,21 L25,21 L25,23 L25,23 Z M25,19 L16,19 L16,17 L25,17 L25,19 L25,19 Z"
        fill="currentColor"
      />
    </Svg>
  );
  // return (
  //   <Svg
  //     version="1.1"
  //     viewBox="0 0 32 32"
  //     xmlns="http://www.w3.org/2000/svg"
  //     shape-rendering="geometricPrecision"
  //   >
  //     <defs>
  //       <filter
  //         id="filter949"
  //         x="-.00015765"
  //         y="-9.6866e-5"
  //         width="1.0003"
  //         height="1.0002"
  //         colorInterpolationFilters="sRGB"
  //       >
  //         <feGaussianBlur stdDeviation="0.000237" />
  //       </filter>
  //     </defs>
  //     <g stroke="#000" strokeWidth=".62875">
  //       <rect x="10.388" y="23.77" width="3.8274" height="2.0265" />
  //       <rect x="15.636" y="23.79" width="3.8274" height="2.0265" />
  //       <rect x="20.826" y="23.784" width="3.8274" height="2.0265" />
  //       <rect x="12.991" y="20.388" width="3.8274" height="2.0265" />
  //       <rect x="18.173" y="20.41" width="3.8274" height="2.0265" />
  //     </g>
  //     <g stroke="#f60">
  //       <rect
  //         x="9.4091"
  //         y="9.914"
  //         width="1.8167"
  //         height="11.282"
  //         fill="#f60"
  //         strokeWidth=".66453"
  //       />
  //       <rect
  //         x="23.671"
  //         y="9.9093"
  //         width="1.8167"
  //         height="11.282"
  //         fill="#f60"
  //         strokeWidth=".66453"
  //       />
  //       <path
  //         d="m11.138 10.601c2.0076 0.45852 4.0142 0.9168 6.0956 0.92199 2.0814 0.0052 4.238-0.4423 6.394-0.88967"
  //         fill="none"
  //         strokeWidth="2.0792"
  //       />
  //     </g>
  //     <text
  //       x="14.642925"
  //       y="19.621742"
  //       fill="#ff0000"
  //       filter="url(#filter949)"
  //       fontFamily="sans-serif"
  //       fontSize="9.3333px"
  //       strokeWidth="2.7"
  //       style={{ lineHeight: '1.25' }}
  //       xmlSpace="preserve"
  //     >
  //       <tspan
  //         x="14.642925"
  //         y="19.621742"
  //         fontFamily="sans-serif"
  //         fontSize="9.3333px"
  //         fontStyle="italic"
  //         fontWeight="bold"
  //         strokeWidth="2.7"
  //       >
  //         S
  //       </tspan>
  //     </text>
  //   </Svg>
  // );
}

export default Icon;
