import React from "react";
import { Tag } from "antd";
import "./tags-container.css";

const TagsContainer = ({ predictions }) => (
  <div className="tags-container">
    {predictions.map(
      ({ className, probability }) =>
        probability.toFixed(3) > 0 && (
          <Tag className="tag" key={className} color="geekblue">
            {className.split(",")[0]} {probability.toFixed(3)}
          </Tag>
        )
    )}
  </div>
);

export default TagsContainer;
