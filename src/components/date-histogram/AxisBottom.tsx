import React, { FC } from "react";
import { ScaleTime } from "d3";

import styles from "./AxisBottom.module.css";

type AxisBottomProps = {
  xScale: ScaleTime<number, number, never>;
  innerHeight: number;
  tickFormat: (date: Date) => string;
  tickOffset?: number;
};

const AxisBottom: FC<AxisBottomProps> = ({
  xScale,
  innerHeight,
  tickFormat,
  tickOffset = 3,
}) => {
  return (
    <>
      {xScale.ticks().map((tickValue, index) => (
        <g key={index} transform={`translate(${xScale(tickValue)}, 0)`}>
          <line className={styles.line} y2={innerHeight} />

          <text className={styles.text} dy=".71em" y={innerHeight + tickOffset}>
            {tickFormat(tickValue)}
          </text>
        </g>
      ))}
    </>
  );
};

export default AxisBottom;
