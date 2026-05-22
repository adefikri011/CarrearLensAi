import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          position: "relative",
          padding: "4px",
        }}
      >
        {/* Focusing Lens Circle */}
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Central Target / Glow Node */}
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
            }}
          />
        </div>

        {/* Framing Corners (Focus ticks) */}
        {/* Top-Left */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            width: "4px",
            height: "4px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
            borderTop: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        />
        {/* Top-Right */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            width: "4px",
            height: "4px",
            borderRight: "1px solid rgba(255, 255, 255, 0.5)",
            borderTop: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        />
        {/* Bottom-Left */}
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            left: "5px",
            width: "4px",
            height: "4px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        />
        {/* Bottom-Right */}
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            width: "4px",
            height: "4px",
            borderRight: "1px solid rgba(255, 255, 255, 0.5)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
