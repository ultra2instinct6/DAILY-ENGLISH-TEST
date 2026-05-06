import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../Button';

const CSS_HEIGHT = 160;
const MIN_INK_DISTANCE = 60;

export interface SignaturePadProps {
  /** Stable key — when this changes, the pad clears (e.g. moving to next prompt). */
  resetKey: string | number;
  /** Disable drawing entirely (e.g. when all prompts are complete). */
  disabled?: boolean;
  /** Save button label. */
  saveLabel: string;
  /** Called with a PNG data URL when the user taps Save. */
  onSave: (dataUrl: string) => void;
  /** Optional small status / counter text shown to the right of the slot label. */
  rightHint?: React.ReactNode;
  /** Optional left-side label (e.g. "Signature 3 of 10"). */
  leftLabel?: React.ReactNode;
}

/**
 * Reusable finger-writing pad: high-DPI canvas, smoothed strokes, baseline guides,
 * Clear / Save buttons, and an "enough ink" guard that requires at least
 * MIN_INK_DISTANCE px of stroke before Save enables.
 */
const SignaturePad = ({
  resetKey,
  disabled = false,
  saveLabel,
  onSave,
  rightHint,
  leftLabel,
}: SignaturePadProps) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dprRef = useRef<number>(1);
  const drawingRef = useRef(false);
  // All point refs are in CSS pixel space (matches the canvas 2d transform we install).
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const prevMidRef = useRef<{ x: number; y: number } | null>(null);
  const inkLengthRef = useRef(0);
  const [hasInk, setHasInk] = useState(false);
  const [enoughInk, setEnoughInk] = useState(false);

  const drawBaseline = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = dprRef.current;
    const wCss = c.width / dpr;
    const hCss = c.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, wCss, hCss);
    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(16, hCss - 28);
    ctx.lineTo(wCss - 16, hCss - 28);
    ctx.stroke();
    ctx.strokeStyle = '#edf2f7';
    ctx.beginPath();
    ctx.moveTo(16, hCss / 2);
    ctx.lineTo(wCss - 16, hCss / 2);
    ctx.stroke();
  }, []);

  const sizeCanvas = useCallback(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    if (!wrap || !c) return;
    const cssWidth = Math.max(280, Math.round(wrap.clientWidth));
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
    dprRef.current = dpr;
    c.style.width = `${cssWidth}px`;
    c.style.height = `${CSS_HEIGHT}px`;
    c.width = Math.round(cssWidth * dpr);
    c.height = Math.round(CSS_HEIGHT * dpr);
    drawBaseline();
    inkLengthRef.current = 0;
    setHasInk(false);
    setEnoughInk(false);
  }, [drawBaseline]);

  useEffect(() => {
    sizeCanvas();
    if (typeof ResizeObserver === 'undefined' || !wrapRef.current) return;
    const ro = new ResizeObserver(() => sizeCanvas());
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [sizeCanvas]);

  // Reset pad whenever the parent moves to a new slot/prompt.
  useEffect(() => {
    sizeCanvas();
  }, [resetKey, sizeCanvas]);

  const clearCanvas = () => {
    drawBaseline();
    inkLengthRef.current = 0;
    setHasInk(false);
    setEnoughInk(false);
  };

  /**
   * Returns pointer position in CSS pixels relative to the canvas. Because we install a
   * `setTransform(dpr,0,0,dpr,0,0)` on the 2d context, drawing in CSS coords keeps strokes
   * perfectly aligned with the finger/mouse on Retina displays.
   */
  const getPos = (clientX: number, clientY: number) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    // Account for any CSS scaling (rect.width may differ from the styled width).
    const scaleX = (c.width / dprRef.current) / rect.width;
    const scaleY = (c.height / dprRef.current) / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const applyStrokeStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#0a2540';
    ctx.fillStyle = '#0a2540';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const startStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    try {
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e.clientX, e.clientY);
    drawingRef.current = true;
    lastRef.current = pos;
    prevMidRef.current = pos;
    applyStrokeStyle(ctx);
    // Tap dot so quick taps register as ink.
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1.4, 0, Math.PI * 2);
    ctx.fill();
    setHasInk(true);
  };

  const drawTo = (ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) => {
    const last = lastRef.current ?? pos;
    const prevMid = prevMidRef.current ?? last;
    const mid = { x: (last.x + pos.x) / 2, y: (last.y + pos.y) / 2 };
    // Quadratic Bezier through the previous midpoint, with `last` as the control point
    // and `mid` as the endpoint. This produces visually continuous curves between samples.
    applyStrokeStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(prevMid.x, prevMid.y);
    ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
    ctx.stroke();
    inkLengthRef.current += Math.hypot(pos.x - last.x, pos.y - last.y);
    lastRef.current = pos;
    prevMidRef.current = mid;
  };

  const moveStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    // Use coalesced events when available so fast finger movements stay smooth & aligned.
    const native = e.nativeEvent as PointerEvent & {
      getCoalescedEvents?: () => PointerEvent[];
    };
    const events =
      typeof native.getCoalescedEvents === 'function'
        ? native.getCoalescedEvents()
        : null;
    if (events && events.length > 0) {
      events.forEach((ev) => drawTo(ctx, getPos(ev.clientX, ev.clientY)));
    } else {
      drawTo(ctx, getPos(e.clientX, e.clientY));
    }
    if (!enoughInk && inkLengthRef.current >= MIN_INK_DISTANCE) {
      setEnoughInk(true);
    }
  };

  const endStroke = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (drawingRef.current && e) {
      const ctx = canvasRef.current?.getContext('2d');
      const last = lastRef.current;
      const prevMid = prevMidRef.current;
      if (ctx && last && prevMid) {
        // Finish the stroke by drawing from the last midpoint through to the final point.
        applyStrokeStyle(ctx);
        ctx.beginPath();
        ctx.moveTo(prevMid.x, prevMid.y);
        ctx.quadraticCurveTo(last.x, last.y, last.x, last.y);
        ctx.stroke();
      }
    }
    drawingRef.current = false;
    lastRef.current = null;
    prevMidRef.current = null;
  };

  const handleSave = () => {
    const c = canvasRef.current;
    if (!c || !hasInk || !enoughInk || disabled) return;
    onSave(c.toDataURL('image/png'));
  };

  const statusHint = hasInk
    ? enoughInk
      ? 'Looks good — tap Save.'
      : 'Keep writing… needs a bit more.'
    : 'Draw inside the box on the baseline.';

  return (
    <div>
      <div
        className="label"
        style={{
          marginTop: 16,
          marginBottom: 6,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <span>{leftLabel}</span>
        <span className="muted" style={{ fontSize: 12 }}>
          {rightHint ?? statusHint}
        </span>
      </div>
      <div ref={wrapRef} style={{ width: '100%' }}>
        <canvas
          ref={canvasRef}
          onPointerDown={startStroke}
          onPointerMove={moveStroke}
          onPointerUp={(e) => endStroke(e)}
          onPointerCancel={(e) => endStroke(e)}
          onPointerLeave={(e) => endStroke(e)}
          style={{
            border: '2px dashed #6b7c93',
            borderRadius: 10,
            background: '#ffffff',
            touchAction: 'none',
            display: 'block',
            cursor: disabled ? 'not-allowed' : 'crosshair',
            width: '100%',
            height: CSS_HEIGHT,
            boxShadow: '0 1px 0 rgba(10,37,64,0.04)',
            opacity: disabled ? 0.6 : 1,
          }}
          aria-label="Finger writing pad"
          role="img"
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <Button onClick={clearCanvas} variant="secondary" disabled={!hasInk || disabled}>
          ↺ Clear
        </Button>
        <Button onClick={handleSave} disabled={!hasInk || !enoughInk || disabled}>
          {saveLabel}
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
