import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
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
          borderRadius: "40px",
          position: "relative",
          padding: "20px",
        }}
      >
        {/* Focusing Lens Rings */}
        <div
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            border: "10px solid rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Central Target / Glow Node */}
          <div
            style={{
              width: "36px",
              height: "36px",
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
            top: "28px",
            left: "28px",
            width: "24px",
            height: "24px",
            borderLeft: "4px solid rgba(255, 255, 255, 0.6)",
            borderTop: "4px solid rgba(255, 255, 255, 0.6)",
          }}
        />
        {/* Top-Right */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: "28px",
            width: "24px",
            height: "24px",
            borderRight: "4px solid rgba(255, 255, 255, 0.6)",
            borderTop: "4px solid rgba(255, 255, 255, 0.6)",
          }}
        />
        {/* Bottom-Left */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "28px",
            width: "24px",
            height: "24px",
            borderLeft: "4px solid rgba(255, 255, 255, 0.6)",
            borderBottom: "4px solid rgba(255, 255, 255, 0.6)",
          }}
        />
        {/* Bottom-Right */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "28px",
            width: "24px",
            height: "24px",
            borderRight: "4px solid rgba(255, 255, 255, 0.6)",
            borderBottom: "4px solid rgba(255, 255, 255, 0.6)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
