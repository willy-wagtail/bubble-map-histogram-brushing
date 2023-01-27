import React, { FC, useState } from "react";

import styles from "./App.module.css";
import BubbleMap from "./components/bubble-map";
import DateHistogram, { DateHistogramProps } from "./components/date-histogram";
import {
  MissingMigrantsEvent,
  useMissingMigrantsData,
} from "./hooks/useMissingMigrantData";
import { useWorldAtlas } from "./hooks/useWorldAtlas";

const WIDTH = 960;
const HEIGHT = 780;
const HISTOGRAM_HEIGHT = HEIGHT * 0.3;

const valueAccessor = (d: MissingMigrantsEvent) => d.totalDeadOrMissing;

const dateHistogramProps = (
  data: MissingMigrantsEvent[],
  setBrushExtent: (d: [Date, Date] | null) => void
): DateHistogramProps<MissingMigrantsEvent> => ({
  data,
  setBrushExtent,
  width: WIDTH,
  height: HISTOGRAM_HEIGHT,
  margins: {
    top: 0,
    right: 30,
    bottom: 50,
    left: 50,
  },
  labels: {
    x: "Month",
    y: "Dead or Missing",
  },
  labelOffsets: {
    x: 35,
    y: 40,
  },
  dateAccessor: (d) => d.date,
  yValueAccessor: valueAccessor,
});

const App: FC = () => {
  const worldAtlas = useWorldAtlas();
  const missingMigrantsEvents = useMissingMigrantsData();

  const [dateFilter, setDateFilter] = useState<[Date, Date] | null>(null);

  if (!missingMigrantsEvents || !worldAtlas) {
    return <pre className={styles.pre}>Loading...</pre>;
  }

  const filteredData = dateFilter
    ? missingMigrantsEvents.filter((d) => {
        const date = d.date;
        return date > dateFilter[0] && date < dateFilter[1];
      })
    : missingMigrantsEvents;

  return (
    <div className={styles.charts}>
      {/* <header className={styles.header}>
        <h1 className={styles.heading}>Missing Migrants Data</h1>

        <p>
          The source dataset contains a list of migration events that resulted
          in missing or loss of human life and was sourced from the{" "}
          <a href="https://missingmigrants.iom.int">
            Missing Migrant Project dataset
          </a>{" "}
          on 9th January 2023.
        </p>

        <p>
          The bubble map visualises migration events that had someone die or go
          missing and their geographical locations. Each bubble represents one
          migration event and the radius of the bubble is proportional to the
          number of people missing or dead for that one event. The areas with
          the deepest colours are the areas with the most migration events that
          had someone die or go missing.
        </p>

        <p>
          The historgram shows the total number of people missing or dead during
          migrations aggregated by month. Brush the histogram to select a date
          range.
        </p>
      </header> */}

      <svg width={WIDTH} height={HEIGHT}>
        <BubbleMap<MissingMigrantsEvent>
          data={filteredData}
          valueAccessor={valueAccessor}
          worldAtlas={worldAtlas}
          fallbackMaxDataValue={50000000}
          maxBubbleRadius={20}
          longitude={(d) => d.longitude}
          latitude={(d) => d.latitude}
        />

        <g transform={`translate(0 , ${HEIGHT - HISTOGRAM_HEIGHT})`}>
          <DateHistogram<MissingMigrantsEvent>
            {...dateHistogramProps(missingMigrantsEvents, setDateFilter)}
          />
        </g>
      </svg>
    </div>
  );
};

export default App;
