import type React from "react"

interface SmartSimpleBrilliantProps {
  /** Fixed width from Figma: 482px */
  width?: number | string
  /** Fixed height from Figma: 300px */
  height?: number | string
  /** Optional className to pass to root */
  className?: string
  /** Theme palette */
  theme?: "light" | "dark"
}

/**
 * Smart · Simple · Brilliant – Calendar cards
 * Generated from Figma via MCP with exact measurements (482×300px)
 */
const SmartSimpleBrilliant: React.FC<SmartSimpleBrilliantProps> = ({
  width = 482,
  height = 300,
  className = "",
  theme = "dark",
}) => {
  /* =======================
     THEME TOKENS
  ======================== */
  const themeVars =
    theme === "light"
      ? {
        "--ssb-surface": "#ffffff",
        "--ssb-text": "#1b1919",
        "--ssb-border": "rgba(0,0,0,0.08)",
        "--ssb-inner-border": "rgba(0,0,0,0.12)",
        "--ssb-shadow": "rgba(0,0,0,0.12)",
      }
      : ({
        "--ssb-surface": "#333937",
        "--ssb-text": "#f8f8f8",
        "--ssb-border": "rgba(255,255,255,0.16)",
        "--ssb-inner-border": "rgba(255,255,255,0.12)",
        "--ssb-shadow": "rgba(0,0,0,0.28)",
      } as React.CSSProperties)

  /* =======================
     SHARED CARD STYLE
  ======================== */
  const cardStyle: React.CSSProperties = {
    width: "155.25px",
    background: "var(--ssb-surface)",
    borderRadius: "9px",
    padding: "6px",
    color: "var(--ssb-text)",
    boxShadow: `
      0px 0px 0px 1px var(--ssb-border),
      0px 2px 4px var(--ssb-shadow)
    `,
  }

  /* =======================
     ICONS
  ======================== */
  const img = "http://localhost:3845/assets/1b1e60b441119fb176db990a3c7fe2670a764855.svg"
  const img1 = "http://localhost:3845/assets/a502f04ccfc3811f304b58a3a982a5b6fa070e91.svg"
  const img2 = "http://localhost:3845/assets/9c07375bf3b9f1f1d8a0a24447829eb6f54fa928.svg"
  const img3 = "http://localhost:3845/assets/19500d66798ef5ea9dc9d5f971cd0e9c29674bd3.svg"

  return (
    <div
      className={className}
      style={
        {
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Two calendar cards with colored event rows"
    >
      <div
        style={{
          position: "relative",
          width: "295.297px",
          height: "212.272px",
          transform: "scale(1.2)",
        }}
      >
        {/* ================= LEFT CARD ================= */}
        <div style={{ position: "absolute", left: "123.248px", top: 0 }}>
          <div style={{ transform: "rotate(5deg)" }}>
            <div style={cardStyle}>
              {/* Amber */}
              <Event
                bg="rgba(245,158,11,0.1)"
                bar="#F59E0B"
                text="#92400E"
                time="2:00 PM"
                title="1:1 with Heather"
                icon={img}
              />

              {/* Sky */}
              <Event
                bg="rgba(14,165,233,0.1)"
                bar="#0EA5E9"
                text="#0C4A6E"
                time="2:00 PM"
                title="Concept Design Review II"
                icon={img1}
                tall
              />

              {/* Emerald */}
              <Event
                bg="rgba(16,185,129,0.1)"
                bar="#10B981"
                text="#064E3B"
                time="9:00 AM"
                title="Webinar: Figma ..."
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT CARD ================= */}
        <div style={{ position: "absolute", left: 0, top: "6.075px" }}>
          <div style={{ transform: "rotate(-5deg)" }}>
            <div
              style={{
                ...cardStyle,
                boxShadow: `
                  -8px 6px 11.3px var(--ssb-shadow),
                  0px 0px 0px 1px var(--ssb-border),
                  0px 2px 4px var(--ssb-shadow)
                `,
              }}
            >
              <Event
                bg="rgba(139,92,246,0.1)"
                bar="#8B5CF6"
                text="#581C87"
                time="11:00 AM"
                title="Onboarding Presentation"
                icon={img2}
              />

              <Event
                bg="#FFE4E6"
                bar="#F43F5E"
                text="#BE123C"
                time="4:00 PM"
                title="🍷 Happy Hour"
                icon={img3}
              />

              <Event
                bg="rgba(139,92,246,0.1)"
                bar="#8B5CF6"
                text="#581C87"
                time="11:00 AM"
                title="🍔 New Employee Welcome Lunch!"
                tall
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =======================
   EVENT ROW COMPONENT
======================= */
function Event({
  bg,
  bar,
  text,
  time,
  title,
  icon,
  tall,
}: {
  bg: string
  bar: string
  text: string
  time: string
  title: string
  icon?: string
  tall?: boolean
}) {
  const [t, meridiem] = time.split(" ")

  return (
    <div
      style={{
        width: "100%",
        height: tall ? "79.5px" : "51px",
        borderRadius: "4px",
        overflow: "hidden",
        background: bg,
        display: "flex",
        marginTop: "3px",
      }}
    >
      <div style={{ width: "2.25px", background: bar }} />
      <div style={{ padding: "4.5px", width: "100%" }}>
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          <span style={{ fontSize: "9px", fontWeight: 500, color: text }}>{t}</span>
          <span style={{ fontSize: "9px", fontWeight: 500, color: text }}>{meridiem}</span>

          {icon && (
            <div style={{ background: text, padding: "1.5px", borderRadius: "100px" }}>
              <div style={{ width: "8px", height: "8px", position: "relative" }}>
                <img src={icon} alt="" style={{ position: "absolute", inset: "20% 10%" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ fontSize: "9px", fontWeight: 600, color: text }}>{title}</div>
      </div>
    </div>
  )
}

export default SmartSimpleBrilliant
