// Applique un watermark "LODGE.tn" en bas-à-droite sur une image (browser-only).
// Conserve le ratio, encode en JPEG qualité 0.85.

export type WatermarkOptions = {
  text?: string;
  font?: string;
  opacity?: number;
};

const DEFAULT_TEXT = "LODGE.tn";

export async function applyWatermark(
  source: File,
  options: WatermarkOptions = {},
): Promise<File> {
  if (typeof document === "undefined") return source;

  const text = options.text ?? DEFAULT_TEXT;
  const opacity = options.opacity ?? 0.6;

  const url = URL.createObjectURL(source);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return source;

    ctx.drawImage(img, 0, 0);

    const fontSize = Math.max(16, Math.round(canvas.width * 0.025));
    ctx.font = options.font ?? `600 ${fontSize}px sans-serif`;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "right";

    const margin = Math.round(fontSize * 0.8);
    const x = canvas.width - margin;
    const y = canvas.height - margin;

    ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.6})`;
    ctx.fillText(text, x + 2, y + 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillText(text, x, y);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85),
    );
    if (!blob) return source;

    const baseName = source.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}-wm.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
