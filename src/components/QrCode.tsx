import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export type LogoBgShape = "circle" | "rounded" | "square" | "none";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type QrCodeProps = {
  value: string;
  size?: number | undefined;
  fg?: string | undefined;
  bg?: string | undefined;
  margin?: number | undefined;
  errorCorrectionLevel?: ErrorCorrectionLevel | undefined;
  logo?: string | null | undefined;
  logoSize?: number | undefined; // 0.15 to 0.30 (default: 0.22)
  logoBgShape?: LogoBgShape | undefined;
  className?: string | undefined;
};

export function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  value: string,
  opts: {
    size: number;
    fg: string;
    bg: string;
    margin: number;
    errorCorrectionLevel: ErrorCorrectionLevel;
    logo?: string | null | undefined;
    logoSize?: number | undefined;
    logoBgShape?: LogoBgShape | undefined;
  },
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!value) return resolve();
    const lightColor = opts.bg === "transparent" ? "#00000000" : opts.bg;
    const ecLevel = opts.logo ? "H" : opts.errorCorrectionLevel;

    QRCode.toCanvas(canvas, value, {
      width: opts.size,
      margin: opts.margin,
      errorCorrectionLevel: ecLevel,
      color: { dark: opts.fg, light: lightColor },
    })
      .then(() => {
        if (!opts.logo) {
          resolve();
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve();
            return;
          }

          const center = opts.size / 2;
          const lRatio = Math.max(0.15, Math.min(opts.logoSize || 0.22, 0.3));
          const lSize = opts.size * lRatio;
          const shape = opts.logoBgShape || "circle";
          const pad = shape !== "none" ? lSize * 0.14 : 0;
          const bgSize = lSize + pad * 2;
          const bgX = center - bgSize / 2;
          const bgY = center - bgSize / 2;
          const badgeFill = opts.bg === "transparent" ? "#ffffff" : opts.bg;

          ctx.save();

          // Draw background badge behind logo to isolate it from QR code modules
          if (shape === "circle") {
            ctx.beginPath();
            ctx.arc(center, center, bgSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = badgeFill;
            ctx.fill();
            ctx.lineWidth = Math.max(1, opts.size * 0.006);
            ctx.strokeStyle = opts.fg;
            ctx.stroke();
          } else if (shape === "rounded") {
            const r = bgSize * 0.22;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(bgX, bgY, bgSize, bgSize, r);
            } else {
              ctx.rect(bgX, bgY, bgSize, bgSize);
            }
            ctx.fillStyle = badgeFill;
            ctx.fill();
            ctx.lineWidth = Math.max(1, opts.size * 0.006);
            ctx.strokeStyle = opts.fg;
            ctx.stroke();
          } else if (shape === "square") {
            ctx.fillStyle = badgeFill;
            ctx.fillRect(bgX, bgY, bgSize, bgSize);
            ctx.lineWidth = Math.max(1, opts.size * 0.006);
            ctx.strokeStyle = opts.fg;
            ctx.strokeRect(bgX, bgY, bgSize, bgSize);
          }

          // Clip if circular shape
          const imgX = center - lSize / 2;
          const imgY = center - lSize / 2;

          if (shape === "circle") {
            ctx.beginPath();
            ctx.arc(center, center, lSize / 2, 0, Math.PI * 2);
            ctx.clip();
          }

          ctx.drawImage(img, imgX, imgY, lSize, lSize);
          ctx.restore();
          resolve();
        };
        img.onerror = () => {
          // If logo fails to load, canvas still has valid QR code
          resolve();
        };
        img.src = opts.logo;
      })
      .catch((err) => reject(err));
  });
}

export function QrCode({
  value,
  size = 220,
  fg = "#171717",
  bg = "#ffffff",
  margin = 1,
  errorCorrectionLevel = "M",
  logo = null,
  logoSize = 0.22,
  logoBgShape = "circle",
  className,
}: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    renderQrToCanvas(canvasRef.current, value, {
      size,
      fg,
      bg,
      margin,
      errorCorrectionLevel,
      logo,
      logoSize,
      logoBgShape,
    })
      .then(() => setError(null))
      .catch((e: Error) => setError(e.message));
  }, [value, size, fg, bg, margin, errorCorrectionLevel, logo, logoSize, logoBgShape]);

  if (error) {
    return <p className="text-sm text-destructive">Could not generate QR: {error}</p>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={`QR code for ${value}`}
      width={size}
      height={size}
    />
  );
}

export async function downloadQr(
  value: string,
  filename: string,
  opts: {
    fg: string;
    bg: string;
    format: "png" | "svg";
    size?: number | undefined;
    margin?: number | undefined;
    errorCorrectionLevel?: ErrorCorrectionLevel | undefined;
    logo?: string | null | undefined;
    logoSize?: number | undefined;
    logoBgShape?: LogoBgShape | undefined;
  },
) {
  const targetSize = opts.size || 1024;
  const margin = opts.margin !== undefined ? opts.margin : 1;
  const ecLevel = opts.logo ? "H" : (opts.errorCorrectionLevel || "M");
  const lightColor = opts.bg === "transparent" ? "#00000000" : opts.bg;

  if (opts.format === "svg") {
    // Generate base SVG
    let svg = await QRCode.toString(value, {
      type: "svg",
      width: targetSize,
      margin,
      errorCorrectionLevel: ecLevel,
      color: { dark: opts.fg, light: lightColor },
    });

    // If logo present, embed SVG center element
    if (opts.logo) {
      const center = targetSize / 2;
      const lRatio = Math.max(0.15, Math.min(opts.logoSize || 0.22, 0.3));
      const lSize = targetSize * lRatio;
      const shape = opts.logoBgShape || "circle";
      const pad = shape !== "none" ? lSize * 0.14 : 0;
      const bgSize = lSize + pad * 2;
      const bgX = center - bgSize / 2;
      const bgY = center - bgSize / 2;
      const badgeFill = opts.bg === "transparent" ? "#ffffff" : opts.bg;
      const strokeW = Math.max(1, targetSize * 0.006);

      let badgeMarkup = "";
      if (shape === "circle") {
        badgeMarkup = `<circle cx="${center}" cy="${center}" r="${bgSize / 2}" fill="${badgeFill}" stroke="${opts.fg}" stroke-width="${strokeW}"/>`;
      } else if (shape === "rounded") {
        badgeMarkup = `<rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" rx="${bgSize * 0.22}" fill="${badgeFill}" stroke="${opts.fg}" stroke-width="${strokeW}"/>`;
      } else if (shape === "square") {
        badgeMarkup = `<rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" fill="${badgeFill}" stroke="${opts.fg}" stroke-width="${strokeW}"/>`;
      }

      const imgX = center - lSize / 2;
      const imgY = center - lSize / 2;
      const imageMarkup = `<image x="${imgX}" y="${imgY}" width="${lSize}" height="${lSize}" href="${opts.logo}"/>`;

      svg = svg.replace("</svg>", `${badgeMarkup}${imageMarkup}</svg>`);
    }

    const href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const a = document.createElement("a");
    a.href = href;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // High-resolution PNG via offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;

    await renderQrToCanvas(canvas, value, {
      size: targetSize,
      fg: opts.fg,
      bg: opts.bg,
      margin,
      errorCorrectionLevel: ecLevel,
      logo: opts.logo,
      logoSize: opts.logoSize,
      logoBgShape: opts.logoBgShape,
    });

    const href = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = href;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
