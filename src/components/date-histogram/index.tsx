import React, { FC, PropsWithChildren } from "react";
import {
  timeFormat,
  scaleTime,
  extent,
  scaleLinear,
  bin,
  timeMonths,
  sum,
  max,
  Bin,
} from "d3";

import styles from "./index.module.css";

import Marks, { DateBinnedValue } from "./Marks";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottom";

export type HistogramMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type HistogramLabelOffsets = {
  x: number;
  y: number;
};

export type HistogramLabels = {
  x: string;
  y: string;
};

export type DateHistogramProps<Data> = {
  data: Data[];
  dateAccessor: (data: Data) => Date;
  yValueAccessor: (data: Data) => number;
  width: number;
  height: number;
  margins: HistogramMargins;
  labelOffsets: HistogramLabelOffsets;
  labels: HistogramLabels;
};

const xAxisTickFormat = timeFormat("%d/%m/%y");

const getDateDomain = <Data = unknown,>(
  data: Data[],
  dateAccessor: (data: Data) => Date
): [Date, Date] => {
  const xDomain = extent(data, dateAccessor);

  if (!(xDomain[0] || xDomain[1])) {
    throw new Error(
      "There was an issue getting min and max values for the x-axis."
    );
  }

  return xDomain;
};

const dateBinnedValue = <Data = unknown,>(
  bin: Bin<Data, Date>,
  yValueAccessor: (data: Data) => number
): DateBinnedValue => {
  if (!(bin.x0 && bin.x1)) {
    throw new Error(
      "There was an issue getting start and/or end dates for this bin."
    );
  }

  return {
    value: sum(bin, yValueAccessor),
    startDate: bin.x0,
    endDate: bin.x1,
  };
};

const getYDomain = (binnedData: DateBinnedValue[]): [number, number] => {
  const maxValue = max(binnedData, (d: DateBinnedValue) => d.value);

  if (!maxValue) {
    throw new Error("There was an issue getting the max value for the y-axis.");
  }

  return [0, maxValue];
};

const DateHistogram = <Data = unknown,>({
  data,
  dateAccessor,
  yValueAccessor,
  width,
  height,
  margins,
  labelOffsets,
  labels,
}: PropsWithChildren<DateHistogramProps<Data>>) => {
  const innerHeight = height - margins.top - margins.bottom;
  const innerWidth = width - margins.left - margins.right;

  const dateDomain = getDateDomain(data, dateAccessor);

  const dateScale = scaleTime()
    .domain(dateDomain)
    .range([0, innerWidth])
    .nice();

  const binnedData: DateBinnedValue[] = bin<Data, Date>()
    .value(dateAccessor)
    .domain(dateDomain)
    .thresholds(timeMonths(...dateDomain))(data)
    .map((bin) => dateBinnedValue(bin, yValueAccessor));

  const yScale = scaleLinear()
    .domain(getYDomain(binnedData))
    .range([innerHeight, 0]);

  return (
    <>
      <rect width={width} height={height} fill="white" />

      <g transform={`translate(${margins.left}, ${margins.top})`}>
        <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />

        <AxisBottom
          xScale={dateScale}
          innerHeight={innerHeight}
          tickOffset={5}
          tickFormat={xAxisTickFormat}
        />

        <text
          className={styles.axisLabel}
          x={innerWidth / 2}
          y={innerHeight + labelOffsets.x}
          textAnchor="middle"
        >
          {labels.x}
        </text>

        <text
          className={styles.axisLabel}
          textAnchor="middle"
          transform={`translate(${-labelOffsets.y},${
            innerHeight / 2
          }) rotate(-90)`}
        >
          {labels.y}
        </text>

        <Marks
          binnedData={binnedData}
          xScale={dateScale}
          yScale={yScale}
          innerHeight={innerHeight}
        />
      </g>
    </>
  );
};

export default DateHistogram;
