import { useEffect, useState } from "react";
import { csv } from "d3";

type MissingMigrantsCsvRow = {
  "Website Date": string;
  "Total Number of Dead and Missing": string;
  Coordinates: string;
};

const isMissingMigrantsCsvRow = (
  row: unknown
): row is MissingMigrantsCsvRow => {
  return (
    typeof (row as MissingMigrantsCsvRow)["Website Date"] === "string" &&
    typeof (row as MissingMigrantsCsvRow)[
      "Total Number of Dead and Missing"
    ] === "string" &&
    typeof (row as MissingMigrantsCsvRow).Coordinates === "string"
  );
};

const isMissingMigrantsCsvRowArray = (
  rowArray: unknown[]
): rowArray is MissingMigrantsCsvRow[] =>
  rowArray.every(isMissingMigrantsCsvRow);

export type MissingMigrantsEvent = {
  date: Date;
  totalDeadOrMissing: number;
  longitude: number;
  latitude: number;
};

const missingMigrantsDataUrl =
  "https://gist.githubusercontent.com/willy-wagtail/9062899f427340c804262de4177050cf/raw/269f60cf56921ebf8d68a3d8edefb5ea92352591/Missing_Migrants_Global_Figures_allData_2_subset.csv";

const transform = (d: MissingMigrantsCsvRow): MissingMigrantsEvent => {
  const splitCoordinates = d.Coordinates.split(" ");

  return {
    date: new Date(d["Website Date"]),
    totalDeadOrMissing: +d["Total Number of Dead and Missing"],
    longitude: +splitCoordinates[0],
    latitude: +splitCoordinates[1],
  };
};

export const useMissingMigrantsData = () => {
  const [data, setData] = useState<MissingMigrantsEvent[] | null>(null);

  useEffect(() => {
    csv(missingMigrantsDataUrl)
      .then((rows) => {
        if (!isMissingMigrantsCsvRowArray(rows)) {
          throw new Error("Typeguard failed");
        }

        setData(rows.map((row: MissingMigrantsCsvRow) => transform(row)));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return data;
};
