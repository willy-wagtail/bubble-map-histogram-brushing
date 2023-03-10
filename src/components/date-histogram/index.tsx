import React, { PropsWithChildren, useEffect, useMemo, useRef } from "react";
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
  brushX,
  select,
  D3BrushEvent,
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
  setBrushExtent: (d: [Date, Date] | null) => void;
};

const xAxisTickFormat = timeFormat("%b '%y"); //timeFormat("%d/%m/%y");

/**
 * Gets the start and end dates for the x-axis of the date histogram
 */
const getDateDomain = <Data = unknown,>(
  data: Data[],
  dateAccessor: (data: Data) => Date
): [Date, Date] => {
  const domain = extent(data, dateAccessor);

  if (!(domain[0] || domain[1])) {
    throw new Error(
      "There was an issue getting min and max values for the x-axis."
    );
  }

  return domain;
};

/**
 * Computes a data structure containing one value for each histogram bin.
 */
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

const isDateDateTuple = (dates: Date[]): dates is [Date, Date] =>
  dates.length === 2 && dates[0] instanceof Date && dates[1] instanceof Date;

const DateHistogram = <Data = unknown,>({
  data,
  dateAccessor,
  yValueAccessor,
  width,
  height,
  margins,
  labelOffsets,
  labels,
  setBrushExtent,
}: PropsWithChildren<DateHistogramProps<Data>>) => {
  const innerHeight = height - margins.top - margins.bottom;
  const innerWidth = width - margins.left - margins.right;

  const dateDomain = useMemo(
    () => getDateDomain(data, dateAccessor),
    [data, dateAccessor]
  );

  const dateScale = useMemo(() => {
    return scaleTime().domain(dateDomain).range([0, innerWidth]).nice();
  }, [dateDomain]);

  const binnedData: DateBinnedValue[] = useMemo(
    () =>
      bin<Data, Date>()
        .value(dateAccessor)
        .domain(dateDomain)
        .thresholds(timeMonths(...dateDomain))(data)
        .map((bin) => dateBinnedValue(bin, yValueAccessor)),
    [dateAccessor, dateDomain, yValueAccessor, data]
  );

  const yScale = useMemo(
    () => scaleLinear().domain(getYDomain(binnedData)).range([innerHeight, 0]),
    [innerHeight, binnedData]
  );

  const brushRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);

    if (brushRef.current !== null) {
      brush(select(brushRef.current));

      brush.on("brush end", (event: D3BrushEvent<unknown>) => {
        if (event.selection !== null) {
          let dates = event.selection.map((val) => {
            if (typeof val === "number") {
              return dateScale.invert(val);
            } else {
              throw new Error("Error while converting brushing event to Date");
            }
          });

          if (isDateDateTuple(dates)) {
            setBrushExtent(dates);
          } else {
            throw new Error(
              "Typeguard error when converting brushing event.selection to [Date, Date]."
            );
          }
        } else {
          setBrushExtent(null);
        }
      });
    }
  }, [innerWidth, innerHeight]);

  return (
    <>
      <rect
        width={width + margins.left + margins.right}
        height={height + margins.top + margins.left}
        fill="white"
      />

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

        <g ref={brushRef}></g>
      </g>
    </>
  );
};

export default DateHistogram;
