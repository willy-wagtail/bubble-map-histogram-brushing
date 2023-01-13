import { useEffect, useState } from "react";
import { csv, DSVRowArray } from "d3";

type CityCsvRow = {
  city: string;
  lat: string;
  lng: string;
  country: string;
  population: string;
};

const isCityCsvRow = (row: unknown): row is CityCsvRow => {
  return (
    typeof (row as CityCsvRow).city === "string" &&
    typeof (row as CityCsvRow).lat === "string" &&
    typeof (row as CityCsvRow).lng === "string" &&
    typeof (row as CityCsvRow).country === "string" &&
    typeof (row as CityCsvRow).population === "string"
  );
};

const isCityCsvRowArray = (rowArray: unknown[]): rowArray is CityCsvRow[] =>
  rowArray.every(isCityCsvRow);

export type City = {
  city: string;
  lat: number;
  lng: number;
  country: string;
  population: number;
};

const worldCitiesUrl =
  "https://gist.githubusercontent.com/willy-wagtail/8e035ecce41d12c98dbbdb33e42e89f4/raw/6d058d6c3f0e6002725ade03d15041e63a59379c/world_cities.csv";

const transform = (cityFromCsv: CityCsvRow): City => ({
  ...cityFromCsv,
  lat: +cityFromCsv.lat,
  lng: +cityFromCsv.lng,
  population: +cityFromCsv.population,
});

export const useWorldCities = () => {
  const [data, setData] = useState<City[] | null>(null);

  useEffect(() => {
    csv(worldCitiesUrl)
      .then((rows: DSVRowArray<string>) => {
        if (!isCityCsvRowArray(rows)) {
          throw new Error("Typeguard failed");
        }

        setData(rows.map((row: CityCsvRow) => transform(row)));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return data;
};
