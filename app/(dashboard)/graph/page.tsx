"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { Loader2, Network } from "lucide-react";
import { useGraph } from "@/lib/hooks/use-graph";

export default function GraphPage() {
  const router = useRouter();
  const { nodes: rawNodes, edges: rawEdges, loading } = useGraph();

  const { flowNodes, flowEdges } = useMemo(() => {
    const connectedIds = new Set<string>();
    rawEdges.forEach((e) => {
      connectedIds.add(e.source);
      connectedIds.add(e.target);
    });

    // Connected notes pehle center ke paas, isolated notes bahar ki taraf
    const connected = rawNodes.filter((n) => connectedIds.has(n.id));
    const isolated = rawNodes.filter((n) => !connectedIds.has(n.id));
    const ordered = [...connected, ...isolated];

    const innerRadius = 180;
    const outerRadius = 420;

    const flowNodes: Node[] = ordered.map((n, i) => {
      const isConnected = connectedIds.has(n.id);
      const group = isConnected ? connected : isolated;
      const indexInGroup = group.findIndex((g) => g.id === n.id);
      const angleStep = (2 * Math.PI) / Math.max(group.length, 1);
      const radius = isConnected ? innerRadius : outerRadius;
      const centerOffset = isConnected ? 0 : Math.PI / 6;

      return {
        id: n.id,
        position: {
          x:
            500 +
            radius * Math.cos(indexInGroup * angleStep + centerOffset),
          y:
            350 +
            radius * Math.sin(indexInGroup * angleStep + centerOffset),
        },
        data: { label: n.data.label || "Untitled" },
        style: {
          background: isConnected ? "var(--accent-soft)" : "var(--card)",
          color: isConnected ? "var(--primary)" : "var(--foreground)",
          border: isConnected
            ? "1.5px solid var(--primary)"
            : "1px solid var(--border)",
          borderRadius: "10px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: isConnected ? 600 : 500,
          boxShadow: isConnected
            ? "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
            : "none",
        },
      };
    });

    const flowEdges: Edge[] = rawEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: true,
      style: { stroke: "var(--primary)", strokeWidth: 2.5, opacity: 0.8 },
    }));

    return { flowNodes, flowEdges };
  }, [rawNodes, rawEdges]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (rawNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <Network className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground">
          Your graph is empty
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Link notes together using{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            [[note title]]
          </code>{" "}
          inside the editor, and they&apos;ll show up here as connections.
        </p>
      </div>
    );
  }

  const connectedCount = new Set(
    rawEdges.flatMap((e) => [e.source, e.target])
  ).size;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">
        Knowledge Graph
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {rawNodes.length} notes · {rawEdges.length} connections ·{" "}
        {connectedCount} linked
      </p>

      <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-border bg-card">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodeClick={(_, node) => router.push(`/notes/${node.id}`)}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="var(--border)" gap={24} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            maskColor="rgba(0,0,0,0.5)"
            nodeColor="var(--primary)"
            nodeStrokeWidth={0}
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
}