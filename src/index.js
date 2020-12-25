import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "@tensorflow/tfjs";
import * as mobileNet from "@tensorflow-models/mobilenet";
import { Spin } from "antd";
import "antd/dist/antd.css";

import "./styles.css";
import TagsContainer from "./Componenets/TagsContainer";

const TagClassificationDemo = () => {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [imageURL, setImageURl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = await mobileNet.load();
      setModel(model);
    };
    loadModel();
  }, []);

  const handleUploadChange = ({ target }) => {
    setImageURl(URL.createObjectURL(target.files[0]));
  };

  const drawImageOnCanvas = (image, canvas, ctx) => {
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const isLandscape = naturalWidth > naturalHeight;
    ctx.drawImage(
      image,
      isLandscape ? (naturalWidth - naturalHeight) / 2 : 0,
      isLandscape ? 0 : (naturalHeight - naturalWidth) / 2,
      isLandscape ? naturalHeight : naturalWidth,
      isLandscape ? naturalHeight : naturalWidth,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
  };

  const onImageChange = async ({ target }) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawImageOnCanvas(target, canvas, ctx);

    const predictions = await model.classify(canvas, 5);
    console.log(predictions)
    setPredictions(predictions);
  };

  const renderInput = () => (
    <input
      type="file"
      onChange={handleUploadChange}
      accept="image/x-png,image/gif,image/jpeg"
    />
  );

  const renderPreview = () => (
    <canvas className="classified-image" ref={canvasRef}>
      <img alt="preview" onLoad={onImageChange} src={imageURL} />
    </canvas>
  );

  return (
    <div className="app">
      {!model ? (
        <Spin size="large" tip="Loading Tag Classification Model" />
      ) : (
        <>
          {renderInput()}
          {imageURL && renderPreview()}
          {!!predictions.length && <TagsContainer predictions={predictions} />}
        </>
      )}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<TagClassificationDemo />, rootElement);
