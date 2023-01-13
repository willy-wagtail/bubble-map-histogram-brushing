import { useEffect, useState } from "react";
import { json } from "d3";
import { WorldAtlas, feature, mesh } from "topojson";
import { FeatureCollection, MultiLineString } from "geojson";

export type WorldAtlasData = {
  land: FeatureCollection;
  interiors: MultiLineString;
};

const worldAtlasUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

export const useWorldAtlas = () => {
  const [data, setData] = useState<WorldAtlasData | null>(null);

  useEffect(() => {
    json<WorldAtlas>(worldAtlasUrl)
      .then((topojson) => {
        if (topojson) {
          const { countries, land } = topojson.objects;

          setData({
            land: feature(topojson, land),
            interiors: mesh(topojson, countries, (a, b) => a !== b),
          });
        } else {
          setData(null); // Server returns status code "204 No Content" or "205 Reset Content"
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return data;
};
