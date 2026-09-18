import type { CaseMeta } from "@/content/cases";

/* ===========================================================================
   The share cards, drawn for `next/og` rather than exported as images, so the
   copy on them can't drift from the page they describe.

   Both keep what matters inside the middle 630×630: WhatsApp crops a link's
   preview to a square on some clients, and the square is what India sees.
   =========================================================================== */

export const OG_SIZE = { width: 1200, height: 630 };

const ROOM = {
  backgroundColor: "#0a0908",
  backgroundImage: "radial-gradient(circle at 50% 30%, #2b221c 0%, #0a0908 70%)",
  color: "#f2ede6",
} as const;

/** A case: its name, one line of story, and a phone at 4%. */
export function CaseCard({ meta }: { meta: CaseMeta }) {
  return (
    <div
      style={{
        ...ROOM,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "80px 96px",
        backgroundImage: "radial-gradient(circle at 70% 20%, #2b221c 0%, #0a0908 65%)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>
        <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#ff8a3d" }}>
          A thriller in one sitting
        </div>
        <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 1 }}>{meta.title}</div>
        <div style={{ fontSize: 38, lineHeight: 1.35, color: "rgba(242,237,230,0.72)" }}>{meta.hint}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          width: 250,
          height: 470,
          borderRadius: 44,
          border: "10px solid #1f1f21",
          backgroundColor: "#050505",
          color: "#f2ede6",
          fontSize: 22,
        }}
      >
        {/* A call that has run 31 hours, on a phone that isn't yours. */}
        <div style={{ display: "flex", fontSize: 20, color: "rgba(242,237,230,0.6)" }}>Mumbai Crime Branch</div>
        <div style={{ display: "flex", fontSize: 40, color: "#30d158" }}>31:33:07</div>
        <div style={{ display: "flex", width: 72, height: 72, marginTop: 40, borderRadius: 36, backgroundColor: "#ff3b30" }} />
      </div>
    </div>
  );
}

/** A passed-on phone: an envelope addressed by hand, a phone lit inside it. */
export function EnvelopeCard({ label, said }: { label: readonly string[]; said?: string }) {
  return (
    <div
      style={{
        ...ROOM,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#ff8a3d" }}>
        This came for you
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: 460,
          height: 300,
          marginTop: 70,
          borderRadius: 8,
          backgroundColor: "#a9814f",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          transform: "rotate(-3deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -96,
            left: 176,
            display: "flex",
            width: 116,
            height: 200,
            borderRadius: 18,
            backgroundColor: "#0b0b0c",
            border: "3px solid #2a2a2c",
            boxShadow: "0 -10px 50px rgba(255,150,80,0.35)",
            transform: "rotate(8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            height: 236,
            borderRadius: 8,
            backgroundColor: "#b08855",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 56,
            bottom: 54,
            display: "flex",
            flexDirection: "column",
            padding: "14px 22px",
            backgroundColor: "#f1ece2",
            color: "#1b1a18",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 3,
            lineHeight: 1.15,
            transform: "rotate(1.5deg)",
          }}
        >
          {label.map((line) => (
            <div key={line} style={{ display: "flex" }}>
              {line}
            </div>
          ))}
        </div>
      </div>
      {/* The sender's result, if they finished: the spoiler-free brag, and the question. */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 30, color: "rgba(242,237,230,0.72)" }}>
        {said && <div style={{ display: "flex", color: "#f2ede6" }}>{said}</div>}
        <div style={{ display: "flex" }}>Would you have cut the call?</div>
      </div>
    </div>
  );
}
