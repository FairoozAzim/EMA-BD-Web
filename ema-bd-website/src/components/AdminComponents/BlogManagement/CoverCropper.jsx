import { useRef, useState } from "react";
import Swal from "sweetalert2";

/* ---------- Cover image rules (shared by blogs and events) ---------- */
export const COVER_RATIO = 16 / 9;
export const COVER_MAX_WIDTH = 1600; // output is at most 1600x900

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const warn = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonColor: "#0F2A5F",
  });

/* ---------- Cover cropper (fixed 16:9 frame) ---------- */
/*
  Props:
  - source:  { url, image, width, height } -> the loaded image to crop
  - onCancel(): called when the user cancels
  - onApply(file): called with the cropped JPEG File
*/
const CoverCropper = ({ source, onCancel, onApply }) => {
  const { image, width, height } = source;
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  // center = the point of the image (in natural pixels) shown at the frame center.
  // Starts at the image center, so the first crop is an automatic center crop.
  const [center, setCenter] = useState({ x: width / 2, y: height / 2 });

  // Visible area of the image (natural pixels) at the current zoom
  const baseW = width / height >= COVER_RATIO ? height * COVER_RATIO : width;
  const baseH = baseW / COVER_RATIO;
  const visW = baseW / zoom;
  const visH = baseH / zoom;
  const cx = clamp(center.x, visW / 2, width - visW / 2);
  const cy = clamp(center.y, visH / 2, height - visH / 2);

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, cx, cy };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || !frameRef.current) return;

    const rect = frameRef.current.getBoundingClientRect();
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    setCenter({
      x: clamp(
        dragRef.current.cx - (dx / rect.width) * visW,
        visW / 2,
        width - visW / 2,
      ),
      y: clamp(
        dragRef.current.cy - (dy / rect.height) * visH,
        visH / 2,
        height - visH / 2,
      ),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const handleReset = () => {
    setZoom(1);
    setCenter({ x: width / 2, y: height / 2 });
  };

  const handleApply = () => {
    const outW = Math.min(COVER_MAX_WIDTH, Math.round(visW));
    const outH = Math.round(outW / COVER_RATIO);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; // for transparent PNGs
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      cx - visW / 2,
      cy - visH / 2,
      visW,
      visH,
      0,
      0,
      outW,
      outH,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          warn(
            "Crop Failed",
            "Could not process this image. Please try another one.",
          );
          return;
        }
        onApply(
          new File([blob], `cover-${Date.now()}.jpg`, { type: "image/jpeg" }),
        );
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Crop cover image"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-[#0F2A5F]">Crop cover image</h3>
          <p className="mt-1 text-sm text-slate-500">
            Cover images use a 16:9 format. Drag to reposition and use the
            slider to zoom.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div
            ref={frameRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="relative aspect-video w-full cursor-grab touch-none select-none overflow-hidden rounded-xl bg-slate-900 active:cursor-grabbing"
          >
            <img
              src={image.src}
              alt="Crop preview"
              draggable={false}
              className="pointer-events-none absolute max-w-none"
              style={{
                width: `${(width / visW) * 100}%`,
                height: `${(height / visH) * 100}%`,
                left: `${-((cx - visW / 2) / visW) * 100}%`,
                top: `${-((cy - visH / 2) / visH) * 100}%`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/40" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-label="Zoom"
              className="h-2 flex-1 cursor-pointer accent-[#0F2A5F]"
            />
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-[#0F2A5F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b]"
          >
            Apply crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverCropper;