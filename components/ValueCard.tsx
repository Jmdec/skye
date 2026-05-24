"use client";

import { useState } from "react";

interface ValueCardProps {
  num: string;
  name: string;
  body: string;
  borderRight: boolean;
}

export function ValueCard({ num, name, body, borderRight }: ValueCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "36px 32px",
        borderRight: borderRight ? "1px solid rgba(236,72,153,0.15)" : "none",
        background: hovered ? "#fce7f3" : "#fff5f9",
        transition: "background .3s",
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "32px",
          background: "linear-gradient(135deg, #ec4899, #be185d)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "12px",
        }}
      >
        {num}
      </p>
      <h3
        style={{
          fontSize: "15px",
          color: "#500724",
          fontWeight: 400,
          marginBottom: "8px",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {name}
      </h3>
      <p
        style={{
          fontSize: "12px",
          lineHeight: 1.65,
          color: "#9d174d",
          opacity: 0.7,
        }}
      >
        {body}
      </p>
    </div>
  );
}
