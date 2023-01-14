import React, { PropsWithChildren } from "react";

import { WorldAtlasData } from "../../hooks/useWorldAtlas";
import Marks from "./Marks";

export type BubbleMapProps<Data> = {
  worldAtlas: WorldAtlasData;
  data: Data[];
  valueAccessor: (d: Data) => number;
};

const BubbleMap = <Data = unknown,>({
  worldAtlas,
  data,
  valueAccessor,
}: PropsWithChildren<BubbleMapProps<Data>>) => {
  return (
    <Marks<Data>
      data={data}
      valueAccessor={valueAccessor}
      maxBubbleRadius={15}
      fallbackMaxDataValue={50000000}
      worldAtlas={worldAtlas}
    />
  );
};

export default BubbleMap;
