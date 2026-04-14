import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import ThumbnailDaysCounter from "@/components/thumbnail/DaysCounter";
import InstagramReel from "@/components/thumbnail/InstagramReel";
import { fetchMatches } from "@/lib/matches";
import { PROMISE_DATE, RM_LOGO_URL, STREAK_GOAL } from "@/lib/constants";
import { computeStreak } from "@/lib/streak";
import type { Match } from "@/lib/types";

export const revalidate = 3600;

const REEL_URL = "https://www.instagram.com/reel/DW_vH_ZEf1A/";
const AUTHOR_PIC_PATH = "/josshygg.jpeg";

function authorPicExists(): boolean {
  try {
    return existsSync(path.join(process.cwd(), "public", "josshygg.jpeg"));
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const { matches, source, reason } = await fetchMatches();
  const streak = computeStreak(matches);
  const remaining = Math.max(0, STREAK_GOAL - streak);
  const hasAuthorPic = authorPicExists();
  const usingMock = source === "mock";
  const sourceLabel =
    source === "espn"
      ? "DATOS EN VIVO · ESPN"
      : source === "api-football"
        ? "DATOS EN VIVO · API-FOOTBALL"
        : "DATOS DE MUESTRA";

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #0A4A1E 0%, #031A08 45%, #000000 100%)",
      }}
    >
      {/* Halftone overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.65) 1px, transparent 1.5px)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* Football doodle pattern */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ color: "#7CFC4D", opacity: 0.13 }}
      >
        <defs>
          <pattern
            id="footballDoodles"
            x="0"
            y="0"
            width="340"
            height="340"
            patternUnits="userSpaceOnUse"
          >
            {/* Football ball #1 */}
            <g
              transform="translate(55 60) rotate(-12)"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="0" cy="0" r="24" />
              <polygon points="0,-10 9,-3 6,8 -6,8 -9,-3" strokeWidth="2" />
              <line x1="0" y1="-10" x2="0" y2="-24" />
              <line x1="9" y1="-3" x2="22" y2="-10" />
              <line x1="6" y1="8" x2="14" y2="20" />
              <line x1="-6" y1="8" x2="-14" y2="20" />
              <line x1="-9" y1="-3" x2="-22" y2="-10" />
            </g>

            {/* ¡GOL! shout */}
            <text
              x="160"
              y="70"
              fontFamily="Impact, Anton, sans-serif"
              fontStyle="italic"
              fontSize="42"
              fontWeight="900"
              fill="currentColor"
              transform="rotate(-8 160 70)"
            >
              ¡GOL!
            </text>

            {/* Squiggle scribble */}
            <path
              d="M250 130 q 8 -14 16 0 t 16 0 t 16 0 t 16 0"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Star burst */}
            <g transform="translate(50 200) rotate(12)" fill="currentColor">
              <path d="M0 -16 L 5 -5 L 16 -5 L 7 3 L 10 16 L 0 8 L -10 16 L -7 3 L -16 -5 L -5 -5 Z" />
            </g>

            {/* Lightning bolt */}
            <path
              d="M170 180 L 188 165 L 178 182 L 195 168 L 180 205"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Football ball #2 (smaller, opposite tilt) */}
            <g
              transform="translate(285 230) rotate(22) scale(0.7)"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="0" cy="0" r="24" />
              <polygon points="0,-10 9,-3 6,8 -6,8 -9,-3" strokeWidth="2.5" />
              <line x1="0" y1="-10" x2="0" y2="-24" />
              <line x1="9" y1="-3" x2="22" y2="-10" />
              <line x1="6" y1="8" x2="14" y2="20" />
              <line x1="-6" y1="8" x2="-14" y2="20" />
              <line x1="-9" y1="-3" x2="-22" y2="-10" />
            </g>

            {/* ¡GOOOL! second shout */}
            <text
              x="105"
              y="285"
              fontFamily="Impact, Anton, sans-serif"
              fontStyle="italic"
              fontSize="30"
              fontWeight="900"
              fill="currentColor"
              transform="rotate(6 105 285)"
            >
              ¡GOOOL!
            </text>

            {/* Whistle */}
            <g
              transform="translate(245 290) rotate(-10)"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="-14" y="-7" width="22" height="14" rx="3" />
              <circle cx="-8" cy="0" r="3" />
              <path d="M8 -4 Q 16 0 8 4" />
            </g>

            {/* Small star */}
            <g transform="translate(20 290) rotate(-20)" fill="currentColor">
              <path d="M0 -8 L 2.5 -2.5 L 8 -2.5 L 3.5 1.5 L 5 8 L 0 4 L -5 8 L -3.5 1.5 L -8 -2.5 L -2.5 -2.5 Z" />
            </g>

            {/* Curved swoosh */}
            <path
              d="M5 110 Q 30 95 55 115"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footballDoodles)" />
      </svg>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-16">
        {/* HERO with Instagram reel */}
        <section className="relative">
          <div className="relative mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-12 items-center">
            {/* Instagram reel framed with lime dashed border + arrow */}
            <div className="relative mx-auto md:mx-0">
              <div
                className="relative mx-auto"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
                  maxWidth: "380px",
                }}
              >
                <div
                  className="relative rounded-3xl overflow-hidden border-[6px]"
                  style={{
                    borderColor: "#7CFC4D",
                    borderStyle: "dashed",
                    background: "#061812",
                    padding: "10px",
                  }}
                >
                  <InstagramReel url={REEL_URL} />
                </div>
                {/* "MIRA EL VIDEO" sticker */}
                <span
                  className="absolute -top-5 left-4 font-display italic text-base md:text-lg px-3 py-1 rounded-full border-4 border-black z-30"
                  style={{
                    background: "#B6FF5C",
                    color: "#000",
                    transform: "rotate(-6deg)",
                    boxShadow: "4px 4px 0 #000",
                  }}
                >
                  ▶ MIRA EL VIDEO
                </span>
              </div>

            </div>

            <div className="relative text-center md:text-left">
              {/* Big curved arrow in the gutter, pointing back at the reel */}
              <svg
                className="hidden md:block absolute -left-16 lg:-left-20 -top-10 w-28 lg:w-36 pointer-events-none"
                viewBox="0 0 200 120"
                fill="none"
                aria-hidden
              >
                <path
                  d="M180 30 Q 100 130 25 70"
                  stroke="#7CFC4D"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M25 70 L 50 55 M25 70 L 45 92"
                  stroke="#7CFC4D"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>

              {/* Inline ¡INCREÍBLE! sticker above the headline */}
              <span
                className="hidden md:inline-block font-display italic text-xl lg:text-2xl px-4 py-1.5 rounded-full mb-3 select-none"
                style={{
                  color: "#000",
                  background: "#B6FF5C",
                  transform: "rotate(-3deg)",
                  border: "4px solid #000",
                  boxShadow: "5px 5px 0 #000",
                }}
              >
                ¡INCREÍBLE!
              </span>
              <h1
                className="font-display italic uppercase leading-[0.85] tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                  color: "#FFFFFF",
                  WebkitTextStroke: "3px #000",
                  textShadow: "6px 6px 0 #000",
                  transform: "rotate(-1deg)",
                }}
              >
                ¡WILL NO SE
                <br />
                CORTA EL PELO!
              </h1>

              {/* Day counter inline in hero */}
              <div className="mt-4 md:mt-6">
                <p
                  className="font-display italic text-2xl md:text-3xl"
                  style={{
                    color: "#FFFFFF",
                    WebkitTextStroke: "1.5px #000",
                    textShadow: "3px 3px 0 #000",
                  }}
                >
                  ¡DÍA
                </p>
                <ThumbnailDaysCounter
                  promiseDateIso={PROMISE_DATE.toISOString()}
                  fontSize="clamp(4.5rem, 12vw, 9rem)"
                />
                <p
                  className="font-display italic text-xl md:text-2xl -mt-1"
                  style={{
                    color: "#FFFFFF",
                    WebkitTextStroke: "1.5px #000",
                    textShadow: "3px 3px 0 #000",
                  }}
                >
                  SIN CORTAR EL PELO!
                </p>
              </div>

              <p
                className="mt-6 font-display italic uppercase text-xl md:text-2xl max-w-xl mx-auto md:mx-0 leading-[1.6]"
                style={{
                  color: "#FFFFFF",
                  WebkitTextStroke: "1.5px #000",
                  textShadow: "3px 3px 0 #000",
                }}
              >
                Hasta que el{" "}
                <span
                  className="inline-block font-display italic text-lg md:text-xl px-3 py-0.5 rounded-lg border-[3px] border-black align-middle tracking-[0.08em]"
                  style={{
                    background: "#FFFFFF",
                    color: "#000000",
                    transform: "rotate(-2deg)",
                    boxShadow: "3px 3px 0 #000",
                    WebkitTextStroke: "0.5px #000",
                    textShadow: "none",
                  }}
                >
                  REAL MADRID
                </span>{" "}
                gane{" "}
                <span
                  className="inline-block font-display italic text-lg md:text-xl px-3 py-0.5 rounded-lg border-[3px] border-black align-middle tracking-[0.08em]"
                  style={{
                    background: "#7CFC4D",
                    color: "#000000",
                    transform: "rotate(1.5deg)",
                    boxShadow: "3px 3px 0 #000",
                    WebkitTextStroke: "0.5px #000",
                    textShadow: "none",
                  }}
                >
                  5 PARTIDOS SEGUIDOS
                </span>{" "}
                sin que les piten un{" "}
                <span
                  className="inline-block font-display italic text-lg md:text-xl px-3 py-0.5 rounded-lg border-[3px] border-black align-middle tracking-[0.08em]"
                  style={{
                    background: "#FFFFFF",
                    color: "#D40000",
                    transform: "rotate(-1.5deg)",
                    boxShadow: "3px 3px 0 #000",
                    WebkitTextStroke: "0.5px #D40000",
                    textShadow: "none",
                  }}
                >
                  PENALTI A FAVOR DEL REAL MADRID
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        {/* STREAK card */}
        <section className="mt-16 md:mt-24 flex justify-center">
          <div
            className="relative border-[6px] border-black rounded-3xl px-8 md:px-12 py-8 md:py-10 transform -rotate-2"
            style={{
              background: "#7CFC4D",
              boxShadow: "12px 12px 0 #000",
            }}
          >
            <p
              className="font-display italic text-2xl md:text-3xl text-center"
              style={{
                color: "#FFFFFF",
                WebkitTextStroke: "1px #000",
              }}
            >
              ¡RACHA ACTUAL!
            </p>
            <div className="flex items-baseline gap-2 justify-center mt-2">
              <span
                className="font-display italic text-black"
                style={{
                  fontSize: "clamp(6rem, 18vw, 12rem)",
                  lineHeight: "0.85",
                  WebkitTextStroke: "3px #000",
                }}
              >
                {streak}
              </span>
              <span className="font-display italic text-4xl md:text-6xl text-black/70">
                /5
              </span>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              {Array.from({ length: STREAK_GOAL }).map((_, i) => (
                <span
                  key={i}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-black flex items-center justify-center text-lg"
                  style={
                    i < streak
                      ? { background: "#08401C", color: "#B6FF5C" }
                      : { background: "#FFFFFF", color: "#000" }
                  }
                  aria-hidden
                >
                  {i < streak ? "✓" : "✗"}
                </span>
              ))}
            </div>
            <p className="font-body text-sm text-black text-center mt-4 font-bold uppercase">
              {remaining > 0
                ? `¡FALTAN ${remaining} VICTORIAS!`
                : "¡PROMESA CUMPLIDA!"}
            </p>
            {/* Corner sticker */}
            <span
              className="absolute -top-4 -right-4 text-white font-display italic px-3 py-1 rounded-full border-4 border-black text-sm"
              style={{ background: "#08401C", transform: "rotate(15deg)" }}
            >
              ¡HOY!
            </span>
          </div>
        </section>

        {/* Match list */}
        <section className="mt-16 md:mt-24">
          <div className="flex flex-col items-center mb-8 gap-3">
            <h2
              className="font-display italic text-center text-4xl md:text-6xl"
              style={{
                color: "#FFFFFF",
                WebkitTextStroke: "3px #000",
                textShadow: "5px 5px 0 #000",
                transform: "rotate(-1deg)",
              }}
            >
              ¡LOS ÚLTIMOS 6!
            </h2>
            <span
              className="inline-flex items-center gap-2 font-display italic text-xs md:text-sm px-3 py-1 rounded-full border-4 border-black"
              style={{
                background: usingMock ? "#FFD93D" : "#B6FF5C",
                color: "#000",
                transform: "rotate(-1.5deg)",
                boxShadow: "4px 4px 0 #000",
              }}
              title={reason}
            >
              {usingMock ? "⚠ " : "● "}
              {sourceLabel}
            </span>
          </div>

          {matches.length === 0 ? (
            <div
              className="border-[6px] border-black rounded-2xl p-8 max-w-xl mx-auto text-center"
              style={{ background: "#7CFC4D", boxShadow: "8px 8px 0 #000" }}
            >
              <p className="font-display italic text-2xl text-black">
                ¡AÚN NO HAY PARTIDOS!
              </p>
              <p className="font-body text-sm text-black mt-2">
                Esperando al primer partido desde la promesa...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matches.slice(0, 6).map((m, i) => (
                <ThumbnailMatchCard key={m.fixtureId} match={m} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Los Futbolitos socials */}
        <section className="mt-20 text-center">
          <h3
            className="font-display italic text-3xl md:text-5xl mb-6"
            style={{
              color: "#FFFFFF",
              WebkitTextStroke: "2px #000",
              textShadow: "4px 4px 0 #000",
              transform: "rotate(-1deg)",
              display: "inline-block",
            }}
          >
            ¡SIGUE A LOS FUTBOLITOS!
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="https://www.youtube.com/@losfutbolitos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-4 border-black transform hover:scale-105 transition-transform"
              style={{ background: "#FF0000", boxShadow: "6px 6px 0 #000" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-white"
                aria-hidden
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z" />
              </svg>
              <span
                className="font-display italic text-2xl md:text-3xl text-white"
                style={{ WebkitTextStroke: "1px #000" }}
              >
                YOUTUBE
              </span>
            </a>

            <a
              href="https://www.instagram.com/losfutbolitostv/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-4 border-black transform hover:scale-105 transition-transform"
              style={{
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                boxShadow: "6px 6px 0 #000",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-white"
                aria-hidden
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span
                className="font-display italic text-2xl md:text-3xl text-white"
                style={{ WebkitTextStroke: "1px #000" }}
              >
                INSTAGRAM
              </span>
            </a>
          </div>
        </section>

        {/* Author credit card — standout */}
        <section className="mt-20 flex justify-center">
          <a
            href="https://www.instagram.com/josshygg/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-5 border-[6px] border-black rounded-3xl px-6 md:px-8 py-5 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-transform"
            style={{
              background:
                "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              boxShadow: "10px 10px 0 #000",
            }}
          >
            {/* Profile pic with dashed lime ring */}
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[5px] border-black flex-shrink-0"
              style={{ background: "#08401C" }}
            >
              {hasAuthorPic ? (
                <Image
                  src={AUTHOR_PIC_PATH}
                  alt="Foto de perfil de @josshygg"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center font-display italic text-4xl"
                  style={{ color: "#7CFC4D" }}
                >
                  J
                </div>
              )}
            </div>

            <div className="text-left">
              <p
                className="font-body text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/90"
              >
                Página hecha por
              </p>
              <p
                className="font-display italic text-2xl md:text-3xl text-white flex items-center gap-2 mt-0.5"
                style={{ WebkitTextStroke: "1.5px #000" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 md:w-7 md:h-7"
                  aria-hidden
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                @Josshygg
              </p>
              <p className="font-body text-[10px] md:text-xs uppercase tracking-widest text-white/80 mt-1 group-hover:text-white">
                ▶ Sígueme en Instagram
              </p>
            </div>

            {/* Corner sticker */}
            <span
              className="absolute -top-4 -right-4 text-black font-display italic px-3 py-1 rounded-full border-4 border-black text-xs"
              style={{
                background: "#7CFC4D",
                transform: "rotate(15deg)",
                boxShadow: "3px 3px 0 #000",
              }}
            >
              ¡FAN!
            </span>
          </a>
        </section>

        {/* Footer disclaimer */}
        <footer
          className="mt-10 text-center font-body text-xs uppercase tracking-wider"
          style={{ color: "rgba(244,247,238,0.55)" }}
        >
          <span className="text-lf-lime">Inspirado en Los Futbolitos</span> · No
          oficial
        </footer>
      </main>
    </div>
  );
}

function ThumbnailMatchCard({ match, index }: { match: Match; index: number }) {
  const isCleanWin = match.result === "W" && !match.penaltyAwardedToRM;
  const isPenaltyWin = match.result === "W" && match.penaltyAwardedToRM;

  let badge = "¡PIM-PAM!";
  let badgeColor = "#7CFC4D";
  let bg = "linear-gradient(135deg, #08401C 0%, #061812 100%)";

  if (isCleanWin) {
    badge = "¡VICTORIA LIMPIA!";
    badgeColor = "#B6FF5C";
    bg = "linear-gradient(135deg, #0F7A36 0%, #08401C 100%)";
  } else if (isPenaltyWin) {
    badge = "¡PERO CON PENALTI!";
    badgeColor = "#FFA500";
    bg = "linear-gradient(135deg, #4a3000 0%, #1a1100 100%)";
  } else if (match.result === "D") {
    badge = "¡DRAMA!";
    badgeColor = "#7CFC4D";
  } else if (match.result === "L") {
    badge = "¡DESASTRE!";
    badgeColor = "#FF6B6B";
    bg = "linear-gradient(135deg, #330000 0%, #1a0000 100%)";
  }

  const rot = index % 2 === 0 ? -1.5 : 1.5;

  return (
    <article
      className="relative rounded-2xl border-4 border-black p-5 overflow-hidden"
      style={{
        background: bg,
        transform: `rotate(${rot}deg)`,
        boxShadow: "8px 8px 0 #000",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.5px)",
          backgroundSize: "6px 6px",
        }}
      />

      {/* Escudo del rival como marca de agua grande */}
      {match.opponentLogo && (
        <div
          aria-hidden
          className="absolute -top-6 -right-6 w-40 h-40 pointer-events-none"
          style={{
            opacity: 0.18,
            filter: "drop-shadow(0 4px 0 #000)",
            transform: "rotate(8deg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={match.opponentLogo}
            alt=""
            width={160}
            height={160}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="relative">
        <p className="font-body text-[10px] uppercase tracking-wider text-white/60">
          {new Date(match.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
          })}{" "}
          · {match.competition}
        </p>

        {/* Matchup con escudos inline */}
        <div className="flex items-center gap-2 mt-1">
          <MatchCrest src={RM_LOGO_URL} alt="Real Madrid" />
          <span
            className="font-display italic text-xs md:text-sm text-white/70"
            style={{ WebkitTextStroke: "0.5px #000" }}
          >
            VS
          </span>
          {match.opponentLogo ? (
            <MatchCrest src={match.opponentLogo} alt={match.opponent} />
          ) : null}
          <h3
            className="font-display italic text-xl md:text-2xl text-white leading-tight ml-1 truncate"
            style={{ WebkitTextStroke: "1px #000" }}
          >
            {match.opponent.toUpperCase()}
          </h3>
        </div>
        <p className="font-body text-[10px] uppercase tracking-wider text-white/50 mt-1">
          {match.homeAway === "H" ? "en el Bernabéu" : "fuera de casa"}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span
            className="font-display italic text-5xl md:text-6xl tabular-nums"
            style={{
              color: "#7CFC4D",
              WebkitTextStroke: "2px #000",
              textShadow: "3px 3px 0 #000",
            }}
          >
            {match.goalsFor}-{match.goalsAgainst}
          </span>
          <span
            className="font-display italic text-xs md:text-sm px-3 py-1 rounded-full border-2 border-black"
            style={{
              background: badgeColor,
              color: "#000",
              transform: "rotate(-3deg)",
            }}
          >
            {badge}
          </span>
        </div>
      </div>
    </article>
  );
}

function MatchCrest({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-black flex-shrink-0"
      style={{ background: "#FFFFFF" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={36}
        height={36}
        className="w-6 h-6 md:w-7 md:h-7 object-contain"
      />
    </span>
  );
}
