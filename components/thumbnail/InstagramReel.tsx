"use client";

import { useEffect } from "react";

interface Props {
  url: string;
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_ID = "instagram-embed-script";

export default function InstagramReel({ url }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
      return;
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#000",
        border: 0,
        borderRadius: "12px",
        margin: 0,
        maxWidth: "540px",
        minWidth: "280px",
        padding: 0,
        width: "100%",
      }}
    />
  );
}
