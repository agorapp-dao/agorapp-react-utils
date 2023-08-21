import { EmbeddedEditor } from "agorapp-react-utils";
import React from "react";

export const ExampleBasic = () => {
  return (<EmbeddedEditor
    aspectRatio={"4:3"}
    courseSlug="solidity"
    lessonSlug={"optimized-array-sum"}
    style={{ border: "1px solid #000", borderRadius: "15px" }}
  />);
};
