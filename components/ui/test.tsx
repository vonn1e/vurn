"use client"

// AsciiArt — "test", made with the 21st.dev ASCII editor and baked
// to its exact rendered output (looping video + poster). Zero dependencies:
// one <video> that fills its parent. Drop it behind or inside your content:
// <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
// https://21st.dev/community/ascii/editor?from=b6e23c2a-9cc5-4292-8bdf-de8767a22ae7
export function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src={"https://assets.21st.dev/ascii-recipes/videos/user_3GRKE8E4T91HLBKvL8CImp46wt2/458d850c-821c-471a-b246-4458430c18ce.mp4"}
      poster={"https://assets.21st.dev/ascii-recipes/thumbnails/user_3GRKE8E4T91HLBKvL8CImp46wt2/605a5945-32ee-41fa-b00b-e419ea395aa1.png"}
      autoPlay
      loop
      muted
      playsInline
      aria-label={"test — animated ASCII art"}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  )
}
