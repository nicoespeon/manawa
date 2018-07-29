import React from "react";
import { render } from "react-dom";

import Timer from "./timer";

const App = () => (
  <React.Fragment>
    <h1>
      Manawa <span>helps you stay focus, now</span>
    </h1>
    <Timer />
  </React.Fragment>
);

const wrapper = document.getElementById("app");
wrapper ? render(<App />, wrapper) : false;
