import React, { FC } from "react";
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
import {
  MissingMigrantsEvent,
  useMissingMigrantsData,
} from "../hooks/useMissingMigrantData";

const width = 960;
const height = 500;
const margin = {
  top: 20,
  right: 30,
  bottom: 65,
  left: 90,
};

const xAxisLabelOffset = 50;
const yAxisLabelOffset = 60;

const xAxisLabel = "Time";
const yAxisLabel = "Migrants Dead or Missing";

const xAxisTickFormat = timeFormat("%d/%m/%y");

const getEventDate = (d: MissingMigrantsEvent) => d.date;
const getEventTotalDeadOrMissing = (d: MissingMigrantsEvent) =>
  d.totalDeadOrMissing;

const mapBinToDateBinnedValue = (
  bin: Bin<MissingMigrantsEvent, Date>
): DateBinnedValue => {
  if (!(bin.x0 && bin.x1)) {
    throw new Error(
      "There was an issue getting start and/or end dates for this bin."
    );
  }

  return {
    value: sum(bin, getEventTotalDeadOrMissing),
    startDate: bin.x0,
    endDate: bin.x1,
  };
};

const Histogram: FC = () => {
  const missingMigrantsEvents = useMissingMigrantsData();

  if (!missingMigrantsEvents) {
    return <pre className={styles.pre}>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xDomain = extent(missingMigrantsEvents, getEventDate);

  if (!(xDomain[0] || xDomain[1])) {
    throw new Error(
      "There was an issue getting min and max values for the x-axis."
    );
  }

  const xScale = scaleTime().domain(xDomain).range([0, innerWidth]).nice();

  const [startDate, stopDate] = xScale.domain();

  const binThresholds = timeMonths(startDate, stopDate);

  const binGenerator = bin<MissingMigrantsEvent, Date>()
    .value(getEventDate)
    .domain([startDate, stopDate])
    .thresholds(binThresholds);

  const binnedData: DateBinnedValue[] = binGenerator(missingMigrantsEvents).map(
    mapBinToDateBinnedValue
  );

  const maxValue = max(binnedData, (d: DateBinnedValue) => d.value);

  if (!maxValue) {
    throw new Error("There was an issue getting the max value for the y-axis.");
  }

  const yScale = scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />

        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickOffset={5}
          tickFormat={xAxisTickFormat}
        />

        <text
          className={styles.axisLabel}
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          {xAxisLabel}
        </text>

        <text
          className={styles.axisLabel}
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset},${
            innerHeight / 2
          }) rotate(-90)`}
        >
          {yAxisLabel}
        </text>

        <Marks
          binnedData={binnedData}
          xScale={xScale}
          yScale={yScale}
          innerHeight={innerHeight}
        />
      </g>
    </svg>
  );
};

export default Histogram;
