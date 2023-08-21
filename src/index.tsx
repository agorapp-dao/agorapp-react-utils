import React from "react";
import ReactDOM from "react-dom/client";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
import { ExampleBasic } from "./components/ExampleBasic";
import { ExampleMetaMask } from "./components/ExampleMetaMask";

export const EmbeddedTest = () => {
  return (
   <>
     <h1>Basic example</h1>
     <ExampleBasic />

     <h1>MetaMask integration example</h1>
     <ExampleMetaMask />
   </>
  );
};

root.render(
  <React.StrictMode>
    <EmbeddedTest />
  </React.StrictMode>
);
