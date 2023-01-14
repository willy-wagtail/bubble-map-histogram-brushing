import React, { FC, PropsWithChildren } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule, max, scaleSqrt } from "d3";

import styles from "./Marks.module.css";
import { WorldAtlasData } from "../../hooks/useWorldAtlas";
import { FeatureCollection, MultiLineString } from "geojson";

export type MarksProps<Data> = {
  data: Data[];
  worldAtlas: WorldAtlasData;
  valueAccessor: (d: Data) => number;
  maxBubbleRadius: number;
  fallbackMaxDataValue: number;
};

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticulesGenerator = geoGraticule();

const graticules = path(graticulesGenerator());
const globeOutline = path({ type: "Sphere" });

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

const Bubbles: FC<any> = ({ data, scale, valueAccessor }: any) => {
  return data.map((d: any, index: any) => {
    const coords = projection([d.longitude, d.latitude]);

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
  });
};

const Marks = <Data = unknown,>({
  data,
  worldAtlas,
  valueAccessor,
  maxBubbleRadius,
  fallbackMaxDataValue,
}: PropsWithChildren<MarksProps<Data>>) => {
  const bubbleSizeScale = scaleSqrt()
    .domain([0, max(data, valueAccessor) || fallbackMaxDataValue])
    .range([0, maxBubbleRadius]);

  return (
    <g>
      <WorldMap {...worldAtlas} />

      <Bubbles
        data={data}
        scale={bubbleSizeScale}
        valueAccessor={valueAccessor}
      />
    </g>
  );
};

export default Marks;
