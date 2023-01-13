import React, { FC } from "react";

import styles from "./App.module.css";
import BubbleMap from "./components/bubble-map/BubbleMap";
import DateHistogram, {
  DateHistogramProps,
  HistogramLabelOffsets,
  HistogramLabels,
  HistogramMargins,
} from "./components/date-histogram";
import {
  MissingMigrantsEvent,
  useMissingMigrantsData,
} from "./hooks/useMissingMigrantData";
import { useWorldAtlas } from "./hooks/useWorldAtlas";
import { useWorldCities } from "./hooks/useWorldCities";

const width = 960;
const height = 500;
const histogramHeight = height * 0.2;

const dateHistogramProps = (
  data: MissingMigrantsEvent[]
): DateHistogramProps<MissingMigrantsEvent> => ({
  data,
  width,
  height: histogramHeight,
  margins: {
    top: 0,
    right: 30,
    bottom: 20,
    left: 45,
  },
  labels: {
    x: "Time",
    y: "Dead or Missing",
  },
  labelOffsets: {
    x: 54,
    y: 30,
  },
  dateAccessor: (d) => d.date,
  yValueAccessor: (d) => d.totalDeadOrMissing,
});

const App: FC = () => {
  const missingMigrantsEvents = useMissingMigrantsData();
  const worldAtlas = useWorldAtlas();
  const cities = useWorldCities();

  if (!missingMigrantsEvents || !worldAtlas || !cities) {
    return <pre>Loading...</pre>;
  }

  return (
    <div className={styles.charts}>
      <svg width={width} height={height}>
        <BubbleMap worldAtlas={worldAtlas} cities={cities} />

        <g transform={`translate(0 , ${height - histogramHeight})`}>
          <DateHistogram {...dateHistogramProps(missingMigrantsEvents)} />
        </g>
      </svg>
    </div>
  );
};

export default App;
