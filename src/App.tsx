import React, { FC } from "react";

import styles from "./App.module.css";
import BubbleMap from "./components/bubble-map";
import DateHistogram, { DateHistogramProps } from "./components/date-histogram";
import {
  MissingMigrantsEvent,
  useMissingMigrantsData,
} from "./hooks/useMissingMigrantData";
import { useWorldAtlas } from "./hooks/useWorldAtlas";

const WIDTH = 960;
const HEIGHT = 900;
const HISTOGRAM_HEIGHT = HEIGHT * 0.4;

const valueAccessor = (d: MissingMigrantsEvent) => d.totalDeadOrMissing;

const dateHistogramProps = (
  data: MissingMigrantsEvent[]
): DateHistogramProps<MissingMigrantsEvent> => ({
  data,
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
  const missingMigrantsEvents = useMissingMigrantsData();
  const worldAtlas = useWorldAtlas();

  if (!missingMigrantsEvents || !worldAtlas) {
    return <pre className={styles.pre}>Loading...</pre>;
  }

  return (
    <div className={styles.charts}>
      <svg width={WIDTH} height={HEIGHT}>
        <BubbleMap<MissingMigrantsEvent>
          data={missingMigrantsEvents}
          valueAccessor={valueAccessor}
          worldAtlas={worldAtlas}
          fallbackMaxDataValue={50000000}
          maxBubbleRadius={20}
          longitude={(d) => d.longitude}
          latitude={(d) => d.latitude}
        />

        <g transform={`translate(0 , ${HEIGHT - HISTOGRAM_HEIGHT})`}>
          <DateHistogram<MissingMigrantsEvent>
            {...dateHistogramProps(missingMigrantsEvents)}
          />
        </g>
      </svg>
    </div>
  );
};

export default App;
