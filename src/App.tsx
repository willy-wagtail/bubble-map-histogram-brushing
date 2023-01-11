import React from "react";

import styles from "./App.module.css";
import Histogram from "./Histogram";

function App() {
  return (
    <div className={styles.charts}>
      <Histogram />
    </div>
  );
}

export default App;
