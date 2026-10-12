import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { VALUE_PROPOSITION } from "@/content/home";
import { SOCIAL_IMAGE } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

// Generated social preview image, shared by every page. Replace this file
// with an opengraph-image.png once a designed image exists.
export const alt = SOCIAL_IMAGE.alt;
export const size = { width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height };
export const contentType = "image/png";

export default async function Image() {
  const [interRegular, interBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Inter-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#080808",
          color: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 38,
            lineHeight: 1.35,
            color: "#b3b3b3",
          }}
        >
          {VALUE_PROPOSITION}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );
}
