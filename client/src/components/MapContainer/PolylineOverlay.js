import React from "react";
import { CanvasOverlay } from "react-map-gl";

const PolylineOverlay = props => {
  const _redraw = ({ width, height, ctx, isDragging, project }) => {
    const {
      points,
      color = "black",
      lineWidth = 4,
      renderWhileDragging = true
    } = props;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach(point => {
        const pixel = project([point[0], point[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  };
  return <CanvasOverlay redraw={_redraw} />;
};

export default PolylineOverlay;
