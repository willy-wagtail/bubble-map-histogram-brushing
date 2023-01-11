import React, { FC } from "react";
import { ScaleLinear } from "d3";

import styles from "./AxisLeft.module.css";

type AxisLeftProps = {
  yScale: ScaleLinear<number, number, never>;
  innerWidth: number;
  tickOffset?: number;
};

const AxisLeft: FC<AxisLeftProps> = ({
  yScale,
  innerWidth,
  tickOffset = 3,
}) => {
  return (
    <>
      {yScale.ticks().map((tickValue) => (
        <g key={tickValue} transform={`translate(0, ${yScale(tickValue)})`}>
          <line className={styles.line} x2={innerWidth} />

          <text className={styles.text} x={-tickOffset} dy=".32em">
            {tickValue}
          </text>
        </g>
      ))}
    </>
  );
};

export default AxisLeft;
