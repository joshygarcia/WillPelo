import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "El Pelo de Will — Reto Real Madrid | Los Futbolitos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 30%, #0A4A1E 0%, #031A08 45%, #000000 100%)",
          fontFamily: "Impact, sans-serif",
          position: "relative",
        }}
      >
        {/* Halftone overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.6) 1px, transparent 1.5px)",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            position: "relative",
          }}
        >
          {/* Sticker */}
          <div
            style={{
              background: "#B6FF5C",
              color: "#000",
              padding: "8px 28px",
              borderRadius: "9999px",
              fontSize: "28px",
              fontStyle: "italic",
              border: "4px solid #000",
              boxShadow: "5px 5px 0 #000",
              transform: "rotate(-3deg)",
            }}
          >
            ¡INCREÍBLE!
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "96px",
              fontStyle: "italic",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 0.85,
              WebkitTextStroke: "4px #000",
              textShadow: "8px 8px 0 #000",
              textTransform: "uppercase",
            }}
          >
            ¡WILL NO SE
          </div>
          <div
            style={{
              fontSize: "96px",
              fontStyle: "italic",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 0.85,
              WebkitTextStroke: "4px #000",
              textShadow: "8px 8px 0 #000",
              textTransform: "uppercase",
            }}
          >
            CORTA EL PELO!
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                color: "#000",
                padding: "6px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                fontStyle: "italic",
                border: "3px solid #000",
                boxShadow: "3px 3px 0 #000",
              }}
            >
              REAL MADRID
            </div>
            <div
              style={{
                background: "#7CFC4D",
                color: "#000",
                padding: "6px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                fontStyle: "italic",
                border: "3px solid #000",
                boxShadow: "3px 3px 0 #000",
              }}
            >
              5 PARTIDOS SEGUIDOS
            </div>
            <div
              style={{
                background: "#FFFFFF",
                color: "#D40000",
                padding: "6px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                fontStyle: "italic",
                border: "3px solid #000",
                boxShadow: "3px 3px 0 #000",
              }}
            >
              SIN PENALTI
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              color: "#7CFC4D",
              fontSize: "22px",
              fontStyle: "italic",
              marginTop: "24px",
              opacity: 0.7,
            }}
          >
            Inspirado en Los Futbolitos · will-pelo.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
