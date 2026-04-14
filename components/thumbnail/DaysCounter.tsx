"use client";

import { useEffect, useState } from "react";

interface Props {
  promiseDateIso: string;
  fontSize?: string;
}

function calc(promiseMs: number): number {
  return Math.max(0, Math.floor((Date.now() - promiseMs) / 86_400_000));
}

export default function ThumbnailDaysCounter({
  promiseDateIso,
  fontSize = "clamp(8rem, 28vw, 22rem)",
}: Props) {
  const promiseMs = new Date(promiseDateIso).getTime();
  const [days, setDays] = useState<number>(() => calc(promiseMs));

  useEffect(() => {
    const tick = () => setDays(calc(promiseMs));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [promiseMs]);

  return (
    <span
      className="font-display italic block leading-[0.85]"
      style={{
        fontSize,
        color: "#7CFC4D",
        WebkitTextStroke: "6px #000",
        textShadow:
          "10px 10px 0 #000, 8px 8px 0 #08401C, 0 0 40px rgba(124,252,77,0.65)",
        transform: "rotate(-3deg)",
        display: "inline-block",
      }}
      aria-live="polite"
    >
      {days}
    </span>
  );
}
