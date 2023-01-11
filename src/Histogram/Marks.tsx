import React, { FC } from "react";
import { ScaleLinear, ScaleTime } from "d3";

import styles from "./Marks.module.css";

export type DateBinnedValue = {
  value: number;
  startDate: Date;
  endDate: Date;
};

export type MarksProps = {
  binnedData: DateBinnedValue[];
  xScale: ScaleTime<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  innerHeight: number;
  tooltipFormat?: (value: number) => string;
};

const Marks: FC<MarksProps> = ({
  binnedData,
  xScale,
  yScale,
  tooltipFormat = (d) => d,
  innerHeight,
}) => {
  return (
    <>
      {binnedData.map((d, index) => (
        <rect
          key={index}
          className={styles.mark}
          x={xScale(d.startDate)}
          y={yScale(d.value)}
          width={xScale(d.endDate) - xScale(d.startDate)}
          height={innerHeight - yScale(d.value)}
        >
          <title>{tooltipFormat(d.value)}</title>
        </rect>
      ))}
    </>
  );
};

export default Marks;
