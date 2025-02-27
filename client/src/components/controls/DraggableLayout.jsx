import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
export default function DraggableLayout({
  imageUrl,
  items,
  setItems,
  label,
  saveLayout,
  editable = true,
  width = 800,
}) {
  const [targetWidth] = useState(width);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [selectedItem, setSelectedItem] = useState(items[0]?.name ?? "");
  const [draggingItem, setDraggingItem] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const fovRotation = useSelector((state) => state.stream.fovRotation);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setAspectRatio(image.width / image.height);
      setDimensions({ width: image.width, height: image.height });
    };
  }, [imageUrl]);

  const handleMouseDown = (e, item) => {
    e.preventDefault();
    setDraggingItem(item.name);
  };

  const handleMouseMove = (e) => {
    if (!draggingItem || !editable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // clamp to [0,1] to stay within the image
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    setItems((prev) =>
      prev.map((it) =>
        it.name === draggingItem
          ? { ...it, point: { x: clampedX, y: clampedY } }
          : it
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
  };

  // Convert Three.js radians to degrees
  const toDegrees = (radians) => radians * (180 / Math.PI);
  function getRotationFromYaw(yaw) {
    return -toDegrees(yaw) - 90;
  }

  const selectedItemData = items.find((i) => i.name === selectedItem);
  const selectedX = selectedItemData ? selectedItemData.point.x * targetWidth : 0;
  const selectedY = selectedItemData ? selectedItemData.point.y * (targetWidth / aspectRatio) : 0;

  return (
    <div>
      {editable && (
        <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">--Choose--</option>
          {items.map((it) => (
            <option key={it.name} value={it.name}>
              {it.name}
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
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {fovRotation != null && selectedItemData && (
            <div
              style={{
                position: "absolute",
                top: selectedY - 50,
                left: selectedX,
                transformOrigin: "bottom center",
                transform: `translate(-50%, 0) rotate(${getRotationFromYaw(fovRotation)}deg)`,
                width: 0,
                height: 0,
                borderLeft: "25px solid transparent",
                borderRight: "25px solid transparent",
                borderTop: "50px solid rgba(97, 166, 255, 0.5)",
                pointerEvents: "none", // don't block mouse
              }}
            />
          )}
          {items.map((it) => (
            <div
              key={it.name}
              style={{
                position: "absolute",
                top: it.point.y * (targetWidth / aspectRatio),
                left: it.point.x * targetWidth,
                transform: "translate(-50%, -50%)",
                cursor: "grab",
                backgroundColor: selectedItem === it.name ? "black" : "grey",
                height: 15,
                width: 15,
                borderRadius: "50%",
              }}
              onMouseDown={(e) => handleMouseDown(e, it)}
              onClick={() => setSelectedItem(it.name)}
            />
          ))}
        </div>
      </div>
      {editable && (
        <button onClick={() => saveLayout({ imageUrl, dimensions, items })}>
          Save {label} Layout
        </button>
      )}
    </div>
  );
}
