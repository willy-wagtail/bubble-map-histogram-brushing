import React, { FC } from "react";

import styles from "./App.module.css";
import BubbleMap from "./components/bubble-map/BubbleMap";
import DateHistogram, {
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
const histogramMargins: HistogramMargins = {
  top: 0,
  right: 30,
  bottom: 20,
  left: 45,
};
const histogramLabels: HistogramLabels = {
  x: "Time",
  y: "Dead or Missing",
};
const histogramLabelOffsets: HistogramLabelOffsets = {
  x: 54,
  y: 30,
};
const historgramDateAccessor = (d: MissingMigrantsEvent) => d.date;
const histogramYValue = (d: MissingMigrantsEvent) => d.totalDeadOrMissing;

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
          <DateHistogram
            data={missingMigrantsEvents}
            dateAccessor={historgramDateAccessor}
            yValueAccessor={histogramYValue}
            width={width}
            height={histogramHeight}
            margins={histogramMargins}
            labelOffsets={histogramLabelOffsets}
            labels={histogramLabels}
          />
        </g>
      </svg>
    </div>
  );
};

export default App;
