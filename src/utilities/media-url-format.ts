import { Media } from "@/payload-types";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export function formatMediaUrl(
  media: string | Media | null | undefined,
): string {
  if (!media) return "";

  let url: string | null | undefined = "";

  if (typeof media === "string") {
    url = media;
  } else if (typeof media === "object" && media !== null) {
    url = media.url;
  }

  if (!url) return "";

  if (url.startsWith("http")) return url;

  return `${SERVER_URL}${url}`;
}
