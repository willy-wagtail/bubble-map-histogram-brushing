import React, { FC, PropsWithChildren, useMemo } from "react";

import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule,
  scaleSqrt,
  max,
  ScalePower,
} from "d3";
import { FeatureCollection, MultiLineString } from "geojson";

import { WorldAtlasData } from "../../hooks/useWorldAtlas";
import styles from "./index.module.css";

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticulesGenerator = geoGraticule();

const graticules = path(graticulesGenerator());
const globeOutline = path({ type: "Sphere" });

/**
 * World Map
 */
const GlobeOutline: FC = () =>
  globeOutline !== null ? (
    <path className={styles.globeOutline} d={globeOutline} />
  ) : null;

const Graticules: FC = () =>
  graticules !== null ? (
    <path className={styles.graticules} d={graticules} />
  ) : null;

const Land: FC<{ land: FeatureCollection }> = ({ land }) => (
  <>
    {land.features.map((feature, index) => {
      const pathD = path(feature);

      return pathD !== null ? (
        <path key={index} className={styles.land} d={pathD} />
      ) : null;
    })}
  </>
);

const LandInteriorBorders: FC<{ interiors: MultiLineString }> = ({
  interiors,
}) => {
  const interiorsPath = path(interiors);

  return interiorsPath !== null ? (
    <path className={styles.interiors} d={interiorsPath} />
  ) : null;
};

const WorldMap: FC<WorldAtlasData> = ({ land, interiors }) => (
  <>
    <GlobeOutline />
    <Graticules />
    <Land land={land} />
    <LandInteriorBorders interiors={interiors} />
  </>
);

/**
 * Bubbles
 */
type BubblesProps<Data> = {
  data: Data[];
  scale: ScalePower<number, number, never>;
  valueAccessor: (d: Data) => number;
  longitude: (d: Data) => number;
  latitude: (d: Data) => number;
};

const Bubbles = <Data = unknown,>({
  data,
  scale,
  valueAccessor,
  longitude,
  latitude,
}: BubblesProps<Data>) => {
  return (
    <>
      {data.map((d: Data, index: number) => {
        const coords = projection([longitude(d), latitude(d)]);

        if (coords === null) {
          return null;
        }

        return (
          <circle
            key={index}
            cx={coords[0]}
            cy={coords[1]}
            r={scale(valueAccessor(d))}
          />
        );
      })}
    </>
  );
};

/**
 * BubbleMap
 */
export type BubbleMapProps<Data> = {
  worldAtlas: WorldAtlasData;
  data: Data[];
  valueAccessor: (d: Data) => number;
  maxBubbleRadius: number;
  fallbackMaxDataValue: number;
  longitude: (d: Data) => number;
  latitude: (d: Data) => number;
};

const BubbleMap = <Data = unknown,>({
  data,
  worldAtlas,
  valueAccessor,
  longitude,
  latitude,
  maxBubbleRadius,
  fallbackMaxDataValue,
}: PropsWithChildren<BubbleMapProps<Data>>) => {
  const bubbleSizeScale = useMemo(
    () =>
      scaleSqrt()
        .domain([0, max(data, valueAccessor) || fallbackMaxDataValue])
        .range([0, maxBubbleRadius]),
    [data, valueAccessor, fallbackMaxDataValue, maxBubbleRadius]
  );

  return (
    <g>
      {useMemo(
        () => (
          <WorldMap {...worldAtlas} />
        ),
        [worldAtlas]
      )}

      <Bubbles<Data>
        data={data}
        scale={bubbleSizeScale}
        valueAccessor={valueAccessor}
        longitude={longitude}
        latitude={latitude}
      />
    </g>
  );
};

export default BubbleMap;
