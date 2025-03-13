import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import FadeWrapper from "../core/FadeWrapper";


const instrumentMap = {
  AS: "Alto Saxophone",
  CB_A: "Contrabass (Section A)",
  CL: "Clarinet",
  FG: "Bassoon",
  FL: "Flute",
  HR: "Horn",
  OB: "Oboe",
  TB: "Trombone",
  TI: "Timpani",
  TM: "Tenor Drum",
  TR: "Trumpet",
  TU: "Tuba",
  VC_A: "Cello (Section A)",
  VN_I: "Violin I",
  VN_II: "Violin II"
};

function getInstrumentFullName(abbreviation) {
  return instrumentMap[abbreviation] || abbreviation;
}

export default function DraggableLayout({
  imageUrl,
  items,
  setItems,
  label,
  saveLayout,
  editable = true,
  width = 800,
  type = "orchestra",
  onSelectItem = () => {}
}) {
  const showControls = useSelector((state) => state.stream.showControls);
  const fovRotation = useSelector((state) => state.stream.fovRotation);
  const [targetWidth] = useState(width);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [selectedItem, setSelectedItem] = useState(items[0]?.name ?? "");
  const [draggingItem, setDraggingItem] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      console.log("image", image.width, image.height);
      setAspectRatio(image.width / image.height);
      setDimensions({ width: image.width, height: image.height });
    };
  }, [imageUrl]);

  const handleMouseDown = (e, item) => {
    e.preventDefault();
    setDraggingItem(item.name);
  };

  const selectItem = (name) => {
    setSelectedItem(name);
    onSelectItem(name)
  };

  const handleMouseMove = (e) => {
    if (!draggingItem || !editable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setItems((prev) =>
      prev.map((it) =>
        it.name === draggingItem
          ? { ...it, point: { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) } }
          : it
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
  };

  // Only use rotation logic for "venue" mode
  const updateInitialRotation = (rotation) => {
    if (type === "venue") {
      setItems((prev) =>
        prev.map((it) => (it.name === selectedItem ? { ...it, initialRotation: rotation } : it))
      );
    }
  };

  const toDegrees = (radians) => radians * (180 / Math.PI);
  const getRotationFromYaw = (yaw) => -toDegrees(yaw) - 90;

  const selectedItemData = items.find((i) => i.name === selectedItem);
  const selectedX = selectedItemData ? selectedItemData.point.x * targetWidth : 0;
  const selectedY = selectedItemData ? selectedItemData.point.y * (targetWidth / aspectRatio) : 0;

  const nodeColor = type === "venue" ? "rgb(148, 148, 148)" : "red";
  const nodeSelectedColor = type === "venue" ? "rgb(255, 255, 255)" : "blue";

  const getRotationStyle = (it) => {
    if (type === "orchestra") return {};
    return {
      transformOrigin: "bottom center",
      transform: `translate(-50%, 0) rotate(${it.initialRotation || 0}deg)`,
    };
  };

  return (
    <FadeWrapper visible={showControls}>
      {editable && (
        <select value={selectedItem} onChange={(e) => selectItem(e.target.value)}>
          <option value="">--Choose--</option>
          {items.map((it) => (
            <option key={it.name} value={it.name}>
              {type === "orchestra" ? getInstrumentFullName(it.name) : it.name}
            </option>
          ))}
        </select>
      )}

      <div style={{ marginTop: "1rem" }}>
        <div
          style={{
            width: targetWidth,
            height: targetWidth / aspectRatio,
            position: "relative",
            backgroundColor: "rgba(66, 68, 69, 0.91)",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {type === "venue" &&
            (editable
              ? items.map((it) => (
                  <div
                    key={it.name}
                    style={{
                      position: "absolute",
                      top: selectedY - 60,
                      left: selectedX,
                      width: 0,
                      height: 0,
                      borderLeft: "30px solid transparent",
                      borderRight: "30px solid transparent",
                      borderTop: "60px solid rgba(205, 204, 199, 0.8)",
                      display: selectedItem === it.name ? "block" : "none",
                      pointerEvents: "none",
                      ...getRotationStyle(it),
                    }}
                  />
                ))
              : fovRotation != null &&
                selectedItemData && (
                  <div
                    style={{
                      position: "absolute",
                      top: selectedY - 60,
                      left: selectedX,
                      width: 0,
                      height: 0,
                      borderLeft: "30px solid transparent",
                      borderRight: "30px solid transparent",
                      borderTop: "60px solid rgba(205, 204, 199, 0.8)",
                      pointerEvents: "none",
                      transformOrigin: "bottom center",
                      transform: `translate(-50%, 0) rotate(${getRotationFromYaw(fovRotation) + selectedItemData.initialRotation }deg)`,
                    }}
                  />
                ))}
          {items.map((it) => (
            <div
              key={it.name}
              style={{
                position: "absolute",
                top: it.point.y * (targetWidth / aspectRatio),
                left: it.point.x * targetWidth,
                transform: "translate(-50%, -50%)",
                cursor: editable ? "grab" : "pointer",
                backgroundColor: selectedItem === it.name ? nodeSelectedColor : nodeColor,
                height: width / 25,
                width: width / 25,
                borderRadius: "50%",
              }}
              onMouseDown={(e) => handleMouseDown(e, it)}
              onClick={() => selectItem(it.name)}
            />
          ))}
        </div>
      </div>

      {editable && (
        <button onClick={() => saveLayout({ imageUrl, dimensions, items })}>Save {label} Layout</button>
      )}

      {editable && type === "venue" && selectedItemData && (
        <div>
          <label>Initial Rotation:</label>
          <input
            type="number"
            value={selectedItemData.initialRotation || 0}
            onChange={(e) => updateInitialRotation(Number(e.target.value))}
          />
        </div>
      )}
    </FadeWrapper>
  );
}
