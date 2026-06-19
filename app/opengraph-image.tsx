import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Will abandona el reto del pelo en el día 128 y se tiñe de rubio | Los Futbolitos";
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
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#D40000",
              color: "#FFFFFF",
              padding: "8px 28px",
              borderRadius: "9999px",
              fontSize: "28px",
              fontStyle: "italic",
              border: "4px solid #000",
              boxShadow: "5px 5px 0 #000",
              transform: "rotate(-3deg)",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "9999px",
                background: "#FFFFFF",
                border: "2px solid #000",
              }}
            />
            ¡ÚLTIMA HORA!
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "78px",
              fontStyle: "italic",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 0.9,
              WebkitTextStroke: "4px #000",
              textShadow: "8px 8px 0 #000",
              textTransform: "uppercase",
            }}
          >
            ¡WILL ABANDONA EL RETO!
          </div>
          <div
            style={{
              fontSize: "60px",
              fontStyle: "italic",
              color: "#FFD93D",
              textAlign: "center",
              lineHeight: 0.9,
              WebkitTextStroke: "4px #000",
              textShadow: "8px 8px 0 #000",
              textTransform: "uppercase",
            }}
          >
            DÍA 128 · AHORA ES RUBIO
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
              DÍA 128
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
              NUNCA SE CORTÓ
            </div>
            <div
              style={{
                background: "#FFD93D",
                color: "#000",
                padding: "6px 20px",
                borderRadius: "8px",
                fontSize: "24px",
                fontStyle: "italic",
                border: "3px solid #000",
                boxShadow: "3px 3px 0 #000",
              }}
            >
              AHORA RUBIO
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
            Inspirado en Los Futbolitos · willnosecortaelpelo.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
