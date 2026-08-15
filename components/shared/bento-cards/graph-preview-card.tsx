"use client";

import { useEffect, useRef } from "react";
import { Network } from "lucide-react";

interface MiniNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
}

const LABELS = ["Idea", "Research", "Draft", "Meeting", "Insight", "Todo"];

export function GraphPreviewCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;
    const nodes: MiniNode[] = [];

    function resize() {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < LABELS.length; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          label: LABELS[i],
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 20 || node.x > width - 20) node.vx *= -1;
        if (node.y < 20 || node.y > height - 20) node.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 110) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
        ctx.fill();

        ctx.font = "10px monospace";
        ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
        ctx.fillText(node.label, node.x + 8, node.y + 3);
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();

    const handleResize = () => {
      resize();
      initNodes();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Network className="h-4 w-4" />
        <span>Knowledge Graph</span>
      </div>
      <canvas ref={canvasRef} className="flex-1" aria-hidden="true" />
    </div>
  );
}