"use client";

import {
  AlignHorizontalSpaceAround,
  ArrowDownToLine,
  ArrowLeftRight,
  BarChart3,
  ChevronDown,
  Download,
  FileJson,
  GitBranch,
  Keyboard,
  MousePointer2,
  Plus,
  Sparkles,
  Redo2,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  Upload,
  ZoomIn
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  getBezierPath,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  type Connection,
  type EdgeChange,
  type EdgeProps,
  type NodeChange,
  type NodeProps,
  type ReactFlowInstance
} from "reactflow";
import "reactflow/dist/style.css";
import {
  initialSciLoopEdges,
  initialSciLoopNodes,
  initialSciLoopNotes,
  nodePalette,
  sciloopConnectionLabels,
  sciloopNodeTypes,
  type SciLoopConnectionLabel,
  type SciLoopEdge,
  type SciLoopNode,
  type SciLoopNodeData,
  type SciLoopNodeType
} from "@/lib/sciloop-flow";
import styles from "./sciloop-flow-designer.module.css";
import { ReasoningEnginePanel } from "./reasoning-engine-panel";
import { FlowBenchmarkPanel } from "./flow-benchmark-panel";
import type { FlowBenchmarkResult } from "@/lib/flow-benchmark";

type FlowSnapshot = { nodes: SciLoopNode[]; edges: SciLoopEdge[] };
type FlowDocument = FlowSnapshot & { version: 1; notes: string; exportedAt: string };

function cloneSnapshot(snapshot: FlowSnapshot): FlowSnapshot {
  return {
    nodes: snapshot.nodes.map((node) => ({ ...node, position: { ...node.position }, data: { ...node.data } })),
    edges: snapshot.edges.map((edge) => ({ ...edge, data: edge.data ? { ...edge.data } : undefined, style: edge.style ? { ...edge.style } : undefined }))
  };
}

function SciloopNodeCard({ data, selected }: NodeProps<SciLoopNodeData>) {
  const palette = nodePalette[data.nodeType];
  return (
    <div className={styles.flowNode} style={{ background: palette.fill, borderColor: palette.border, color: palette.text, boxShadow: selected ? `0 0 0 2px ${palette.accent}, 0 0 26px ${palette.border}` : undefined }}>
      <Handle type="target" position={Position.Top} className={styles.nodeHandle} />
      <div className={styles.nodeType} style={{ color: palette.accent }}>{data.nodeType}</div>
      <div className={styles.nodeLabel}>{data.label}</div>
      <div className={styles.nodeHint}><MousePointer2 className="size-3" /> double-click to edit</div>
      <Handle type="source" position={Position.Bottom} className={styles.nodeHandle} />
    </div>
  );
}

function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style, data, selected }: EdgeProps<{ label: SciLoopConnectionLabel }>) {
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <path id={id} className="react-flow__edge-path" d={path} markerEnd={markerEnd as string} style={{ ...style, stroke: selected ? "#f4d35e" : "#48e5ff", strokeWidth: selected ? 2.5 : 1.8 }} />
      <g transform={`translate(${labelX} ${labelY})`} className={styles.edgeLabelGroup}>
        <rect x={-36} y={-11} width={72} height={22} rx={4} fill="#07111c" stroke={selected ? "#f4d35e" : "rgba(72,229,255,.24)"} />
        <text textAnchor="middle" dominantBaseline="central" fill={selected ? "#fff1a7" : "#bfdae2"}>{data?.label ?? "leads to"}</text>
      </g>
    </>
  );
}

const nodeTypes = { sciloop: SciloopNodeCard };
const edgeTypes = { labeled: LabeledEdge };

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[character] ?? character);
}

function buildExportSvg(nodes: SciLoopNode[], edges: SciLoopEdge[]) {
  const width = 196;
  const height = 92;
  const padding = 48;
  const minX = Math.min(...nodes.map((node) => node.position.x), 0) - padding;
  const minY = Math.min(...nodes.map((node) => node.position.y), 0) - padding;
  const maxX = Math.max(...nodes.map((node) => node.position.x + width), width) + padding;
  const maxY = Math.max(...nodes.map((node) => node.position.y + height), height) + padding;
  const exportWidth = maxX - minX;
  const exportHeight = maxY - minY;
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeMarkup = edges.map((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) return "";
    const sx = source.position.x - minX + width / 2;
    const sy = source.position.y - minY + height;
    const tx = target.position.x - minX + width / 2;
    const ty = target.position.y - minY;
    const cy = (sy + ty) / 2;
    const label = edge.data?.label ?? edge.label ?? "leads to";
    return `<path d="M ${sx} ${sy} C ${sx} ${cy}, ${tx} ${cy}, ${tx} ${ty}" fill="none" stroke="#48e5ff" stroke-width="2" marker-end="url(#arrow)"/><text x="${(sx + tx) / 2}" y="${cy - 8}" text-anchor="middle" fill="#b8d2dc" font-family="monospace" font-size="11">${escapeXml(String(label))}</text>`;
  }).join("");
  const nodeMarkup = nodes.map((node) => {
    const palette = nodePalette[node.data.nodeType];
    const x = node.position.x - minX;
    const y = node.position.y - minY;
    return `<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" fill="${palette.fill}" stroke="${palette.border}" stroke-width="1.5"/><text x="${x + 14}" y="${y + 25}" fill="${palette.accent}" font-family="monospace" font-size="10">${escapeXml(node.data.nodeType.toUpperCase())}</text><text x="${x + 14}" y="${y + 53}" fill="#eff7fa" font-family="Arial, sans-serif" font-size="15" font-weight="600">${escapeXml(node.data.label)}</text></g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#48e5ff"/></marker></defs><rect width="100%" height="100%" fill="#040812"/>${edgeMarkup}${nodeMarkup}</svg>`;
}

function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SciLoopFlowDesigner() {
  const [nodes, setNodes] = useState<SciLoopNode[]>(initialSciLoopNodes);
  const [edges, setEdges] = useState<SciLoopEdge[]>(initialSciLoopEdges);
  const [notes, setNotes] = useState(initialSciLoopNotes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("start");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [defaultConnectionLabel, setDefaultConnectionLabel] = useState<SciLoopConnectionLabel>("leads to");
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyLength, setHistoryLength] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("Ready");
  const [isDraggingTool, setIsDraggingTool] = useState(false);
  const [showReasoningEngine, setShowReasoningEngine] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactFlowRef = useRef<ReactFlowInstance<SciLoopNodeData, { label: SciLoopConnectionLabel }> | null>(null);
  const historyRef = useRef<FlowSnapshot[]>([cloneSnapshot({ nodes: initialSciLoopNodes, edges: initialSciLoopEdges })]);
  const historyIndexRef = useRef(0);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId) ?? null;
  const nodeCountLabel = `${nodes.length} nodes / ${edges.length} connections`;

  const commitFlow = useCallback((nextNodes: SciLoopNode[], nextEdges: SciLoopEdge[], nextStatus?: string) => {
    const snapshot = cloneSnapshot({ nodes: nextNodes, edges: nextEdges });
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(snapshot);
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    setHistoryIndex(historyIndexRef.current);
    setHistoryLength(nextHistory.length);
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    if (nextStatus) setStatus(nextStatus);
  }, []);

  const updateNode = useCallback((updates: Partial<SciLoopNodeData>) => {
    if (!selectedNode) return;
    commitFlow(nodes.map((node) => node.id === selectedNode.id ? { ...node, data: { ...node.data, ...updates } } : node), edges, "Node updated");
  }, [commitFlow, edges, nodes, selectedNode]);

  const updateEdgeLabel = useCallback((label: SciLoopConnectionLabel) => {
    if (!selectedEdge) return;
    commitFlow(nodes, edges.map((edge) => edge.id === selectedEdge.id ? { ...edge, label, data: { label }, animated: label === "repeat" || label === "if false" } : edge), "Connection updated");
  }, [commitFlow, edges, nodes, selectedEdge]);

  const addNode = useCallback((nodeType: SciLoopNodeType, position?: { x: number; y: number }) => {
    const id = `${nodeType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const nextNode: SciLoopNode = { id, type: "sciloop", position: position ?? { x: 480, y: 360 }, data: { label: nodeType, nodeType } };
    commitFlow([...nodes, nextNode], edges, `${nodeType} added`);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [commitFlow, edges, nodes]);

  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      const nextNodes = nodes.filter((node) => node.id !== selectedNode.id);
      const nextEdges = edges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id);
      commitFlow(nextNodes, nextEdges, "Node deleted");
      setSelectedNodeId(null);
      return;
    }
    if (selectedEdge) {
      commitFlow(nodes, edges.filter((edge) => edge.id !== selectedEdge.id), "Connection deleted");
      setSelectedEdgeId(null);
    }
  }, [commitFlow, edges, nodes, selectedEdge, selectedNode]);

  const undo = useCallback(() => {
    if (historyIndexRef.current === 0) return;
    historyIndexRef.current -= 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    setHistoryIndex(historyIndexRef.current);
    setNodes(cloneSnapshot(snapshot).nodes);
    setEdges(cloneSnapshot(snapshot).edges);
    setStatus("Undid last change");
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    setHistoryIndex(historyIndexRef.current);
    setNodes(cloneSnapshot(snapshot).nodes);
    setEdges(cloneSnapshot(snapshot).edges);
    setStatus("Redid change");
  }, []);

  const resetFlow = useCallback(() => {
    const snapshot = cloneSnapshot({ nodes: initialSciLoopNodes, edges: initialSciLoopEdges });
    historyRef.current = [snapshot];
    historyIndexRef.current = 0;
    setHistoryIndex(0);
    setHistoryLength(1);
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setNotes(initialSciLoopNotes);
    setSelectedNodeId("start");
    setSelectedEdgeId(null);
    setStatus("Initial SciLoop restored");
  }, []);

  const autoLayout = useCallback(() => {
    const depths = new Map<string, number>(nodes.map((node) => [node.id, 0]));
    for (let pass = 0; pass < nodes.length; pass += 1) {
      edges.forEach((edge) => {
        depths.set(edge.target, Math.max(depths.get(edge.target) ?? 0, (depths.get(edge.source) ?? 0) + 1));
      });
    }
    const rows = new Map<number, number>();
    const nextNodes = nodes.map((node) => {
      const depth = depths.get(node.id) ?? 0;
      const row = rows.get(depth) ?? 0;
      rows.set(depth, row + 1);
      return { ...node, position: { x: depth * 270, y: row * 145 } };
    });
    commitFlow(nextNodes, edges, "Auto-layout applied");
  }, [commitFlow, edges, nodes]);

  const saveFlow = useCallback(() => {
    const documentData: FlowDocument = { version: 1, nodes, edges, notes, exportedAt: new Date().toISOString() };
    downloadText("sciloop-learning-flow.json", JSON.stringify(documentData, null, 2), "application/json");
    setStatus("Flow JSON saved");
  }, [edges, nodes, notes]);

  const exportSvg = useCallback(() => {
    downloadText("sciloop-learning-flow.svg", buildExportSvg(nodes, edges), "image/svg+xml");
    setStatus("SVG exported");
  }, [edges, nodes]);

  const exportPng = useCallback(() => {
    const svgUrl = URL.createObjectURL(new Blob([buildExportSvg(nodes, edges)], { type: "image/svg+xml" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width * 2;
      canvas.height = image.height * 2;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(2, 2);
      context.drawImage(image, 0, 0);
      const anchor = document.createElement("a");
      anchor.href = canvas.toDataURL("image/png");
      anchor.download = "sciloop-learning-flow.png";
      anchor.click();
      URL.revokeObjectURL(svgUrl);
      setStatus("PNG exported");
    };
    image.src = svgUrl;
  }, [edges, nodes]);

  const exportToCandidate = useCallback(() => {
    const transfer = {
      version: 1,
      nodes: nodes.map((node) => ({ id: node.id, label: node.data.label, nodeType: node.data.nodeType, position: node.position })),
      connections: edges.map((edge) => ({ id: edge.id, sourceId: edge.source, targetId: edge.target, label: String(edge.data?.label ?? edge.label ?? "leads to") })),
      exportedAt: new Date().toISOString()
    };
    localStorage.setItem("sciloop-candidate-flow-transfer", JSON.stringify(transfer));
    setStatus("Flow ready for Candidate Graph");
    window.location.assign("/cognitive-engine-laboratory");
  }, [edges, nodes]);

  const loadFlow = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<FlowDocument>;
        if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error("Invalid flow document");
        const loadedNodes = parsed.nodes as SciLoopNode[];
        const loadedEdges = parsed.edges as SciLoopEdge[];
        const snapshot = cloneSnapshot({ nodes: loadedNodes, edges: loadedEdges });
        historyRef.current = [snapshot];
        historyIndexRef.current = 0;
        setHistoryIndex(0);
        setHistoryLength(1);
        setNodes(snapshot.nodes);
        setEdges(snapshot.edges);
        setNotes(typeof parsed.notes === "string" ? parsed.notes : "");
        setSelectedNodeId(snapshot.nodes[0]?.id ?? null);
        setSelectedEdgeId(null);
        setStatus("Flow JSON loaded");
      } catch {
        setStatus("Could not load that JSON file");
      }
    };
    reader.readAsText(file);
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((current) => applyNodeChanges(changes, current) as SciLoopNode[]), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((current) => applyEdgeChanges(changes, current) as SciLoopEdge[]), []);
  const onNodeDragStop = useCallback(() => commitFlow(nodes, edges, "Node moved"), [commitFlow, edges, nodes]);
  const onNodesDelete = useCallback((deleted: SciLoopNode[]) => {
    const deletedIds = new Set(deleted.map((node) => node.id));
    commitFlow(nodes.filter((node) => !deletedIds.has(node.id)), edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)), "Node deleted");
    setSelectedNodeId(null);
  }, [commitFlow, edges, nodes]);
  const onEdgesDelete = useCallback((deleted: SciLoopEdge[]) => {
    const deletedIds = new Set(deleted.map((edge) => edge.id));
    commitFlow(nodes, edges.filter((edge) => !deletedIds.has(edge.id)), "Connection deleted");
    setSelectedEdgeId(null);
  }, [commitFlow, edges, nodes]);
  const onConnect = useCallback((connection: Connection) => {
    const label = defaultConnectionLabel;
    const nextEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}-${Date.now()}`,
      type: "labeled",
      animated: label === "repeat" || label === "if false",
      label,
      data: { label },
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#48e5ff", strokeWidth: 1.8 }
    } as SciLoopEdge;
    commitFlow(nodes, addEdge(nextEdge, edges) as SciLoopEdge[], "Connection added");
  }, [commitFlow, defaultConnectionLabel, edges, nodes]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingTool(false);
    const nodeType = event.dataTransfer.getData("application/sciloop-node") as SciLoopNodeType;
    if (!nodeType || !reactFlowRef.current || !wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    addNode(nodeType, reactFlowRef.current.project({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }));
  }, [addNode]);

  const applyBenchmark = useCallback((result: FlowBenchmarkResult) => {
    commitFlow(result.nodes, result.edges, `${result.name} applied`);
    setSelectedNodeId(result.nodes[0]?.id ?? null);
    setSelectedEdgeId(null);
    setShowBenchmark(false);
  }, [commitFlow]);

  const minimapColor = useCallback((node: SciLoopNode) => nodePalette[node.data.nodeType]?.accent ?? "#48e5ff", []);
  const flowStats = useMemo(() => ({ branches: new Set(edges.filter((edge) => edge.label === "if true" || edge.label === "if false").map((edge) => edge.source)).size, types: new Set(nodes.map((node) => node.data.nodeType)).size }), [edges, nodes]);

  return (
    <div className={styles.portal}>
      <header className={styles.portalHeader}>
        <div>
          <div className={styles.kicker}><GitBranch className="size-4" /> SCILOOP / VISUAL LEARNING ENGINE</div>
          <h1>SciLoop Flow Designer</h1>
          <p>Design the loop that turns experience into transferable understanding.</p>
        </div>
        <div className={styles.headerMeta}><span className={styles.liveDot} /> {status}<b>{nodeCountLabel}</b></div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <Link className={styles.primaryButton} href="/sciloop-best-engine"><Sparkles className="size-4" /> Visual Engine</Link>
          <button type="button" className={styles.reasoningToolbarButton} onClick={() => setShowReasoningEngine(true)}><GitBranch className="size-4" /> Reasoning Engine</button>
          <button type="button" className={styles.optimizerToolbarButton} onClick={() => setShowBenchmark(true)}><BarChart3 className="size-4" /> Benchmark flows</button>
          <button type="button" className={styles.secondaryPrimaryButton} onClick={() => addNode("Unknown")}><Plus className="size-4" /> Add node</button>
          <label className={styles.connectionPicker}>New arrows
            <select value={defaultConnectionLabel} onChange={(event) => setDefaultConnectionLabel(event.target.value as SciLoopConnectionLabel)} aria-label="Default connection label">
              {sciloopConnectionLabels.map((label) => <option key={label}>{label}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.toolbarGroup}>
          <button type="button" className={styles.toolButton} onClick={undo} disabled={historyIndex === 0} aria-label="Undo"><Undo2 className="size-4" /></button>
          <button type="button" className={styles.toolButton} onClick={redo} disabled={historyIndex >= historyLength - 1} aria-label="Redo"><Redo2 className="size-4" /></button>
          <button type="button" className={styles.toolButton} onClick={autoLayout}><AlignHorizontalSpaceAround className="size-4" /> <span>Auto-layout</span></button>
          <button type="button" className={styles.toolButton} onClick={resetFlow}><RotateCcw className="size-4" /> <span>Reset</span></button>
        </div>
        <div className={styles.toolbarGroup}>
          <button type="button" className={styles.toolButton} onClick={saveFlow}><Save className="size-4" /> <span>Save JSON</span></button>
          <button type="button" className={styles.primaryButton} onClick={exportToCandidate} title="Send the complete flow, including nodes and arrows, to the Candidate Graph"><ArrowDownToLine className="size-4" /> <span>Export to Candidate</span></button>
          <button type="button" className={styles.toolButton} onClick={() => fileInputRef.current?.click()}><Upload className="size-4" /> <span>Load</span></button>
          <input ref={fileInputRef} className={styles.hiddenInput} type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) loadFlow(file); event.target.value = ""; }} />
          <div className={styles.exportMenu}><Download className="size-4" /><span>Export</span><ChevronDown className="size-3" /><div className={styles.exportPopover}><button type="button" onClick={exportSvg}><FileJson className="size-4" /> SVG</button><button type="button" onClick={exportPng}><ArrowDownToLine className="size-4" /> PNG</button></div></div>
        </div>
      </div>
      {showReasoningEngine && <ReasoningEnginePanel nodes={nodes} edges={edges} onAddNode={addNode} onClose={() => setShowReasoningEngine(false)} />}
      {showBenchmark && <FlowBenchmarkPanel onApply={applyBenchmark} onClose={() => setShowBenchmark(false)} />}

      <div className={styles.designerShell}>
        <aside className={styles.toolbox}>
          <div className={styles.panelHeading}><span>TOOLBOX</span><strong>Drag into canvas</strong></div>
          <div className={styles.toolboxList}>
            {sciloopNodeTypes.map((nodeType) => {
              const palette = nodePalette[nodeType];
              return <button key={nodeType} type="button" draggable onDragStart={(event) => { event.dataTransfer.setData("application/sciloop-node", nodeType); setIsDraggingTool(true); }} onDragEnd={() => setIsDraggingTool(false)} onClick={() => addNode(nodeType)} style={{ "--node-accent": palette.accent } as React.CSSProperties}><span className={styles.toolboxSwatch} style={{ background: palette.accent }} />{nodeType}<Plus className="size-3.5 opacity-40" /></button>;
            })}
          </div>
          <div className={styles.toolboxFooter}><Keyboard className="size-4" /><span>Delete selected with <b>Backspace</b></span></div>
        </aside>

        <main ref={wrapperRef} className={`${styles.canvasShell} ${isDraggingTool ? styles.canvasDropTarget : ""}`} onDrop={onDrop} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; setIsDraggingTool(true); }} onDragLeave={() => setIsDraggingTool(false)}>
          <div className={styles.canvasLegend}><span><i className={styles.legendDot} /> Select node</span><span><ArrowLeftRight className="size-3.5" /> Drag from a node to connect</span><span><ZoomIn className="size-3.5" /> Zoom {Math.round(zoom * 100)}%</span></div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.22, minZoom: 0.18, maxZoom: 1 }}
            minZoom={0.12}
            maxZoom={2}
            deleteKeyCode={["Backspace", "Delete"]}
            onInit={(instance) => { reactFlowRef.current = instance; setZoom(instance.getZoom()); }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            onConnect={onConnect}
            onNodeClick={(_, node) => { setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
            onNodeDoubleClick={(_, node) => { const nextLabel = window.prompt("Edit node label", node.data.label); if (nextLabel?.trim() && nextLabel.trim() !== node.data.label) { setSelectedNodeId(node.id); commitFlow(nodes.map((item) => item.id === node.id ? { ...item, data: { ...item.data, label: nextLabel.trim() } } : item), edges, "Node label updated"); } }}
            onEdgeClick={(_, edge) => { setSelectedEdgeId(edge.id); setSelectedNodeId(null); }}
            onPaneClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
            onMove={(_, viewport) => setZoom(viewport.zoom)}
            connectionLineStyle={{ stroke: "#f4d35e", strokeWidth: 2 }}
            defaultEdgeOptions={{ type: "labeled", markerEnd: { type: MarkerType.ArrowClosed } }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(72,229,255,.16)" gap={28} size={1} />
            <MiniMap nodeColor={minimapColor} maskColor="rgba(2,6,23,.8)" pannable zoomable />
            <Controls showInteractive={false} />
          </ReactFlow>
          {isDraggingTool && <div className={styles.dropHint}>Drop node into the learning loop</div>}
        </main>

        <aside className={styles.inspector}>
          <section className={styles.inspectorSection}>
            <div className={styles.panelHeading}><span>PROPERTIES</span><strong>{selectedNode ? "Selected node" : selectedEdge ? "Selected connection" : "Nothing selected"}</strong></div>
            {selectedNode && <div className={styles.propertyForm}>
              <label>Node text<input value={selectedNode.data.label} onChange={(event) => updateNode({ label: event.target.value })} /></label>
              <label>Node type<select value={selectedNode.data.nodeType} onChange={(event) => updateNode({ nodeType: event.target.value as SciLoopNodeType })}>{sciloopNodeTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <div><span className={styles.fieldLabel}>Category color</span><div className={styles.colorGrid}>{sciloopNodeTypes.map((type) => <button key={type} type="button" aria-label={`Use ${type} color`} className={selectedNode.data.nodeType === type ? styles.colorSelected : ""} style={{ background: nodePalette[type].accent }} onClick={() => updateNode({ nodeType: type })} />)}</div></div>
              <button type="button" className={styles.deleteButton} onClick={deleteSelected}><Trash2 className="size-4" /> Delete node</button>
            </div>}
            {selectedEdge && <div className={styles.propertyForm}><label>Arrow label<select value={selectedEdge.data?.label ?? "leads to"} onChange={(event) => updateEdgeLabel(event.target.value as SciLoopConnectionLabel)}>{sciloopConnectionLabels.map((label) => <option key={label}>{label}</option>)}</select></label><button type="button" className={styles.deleteButton} onClick={deleteSelected}><Trash2 className="size-4" /> Delete connection</button></div>}
            {!selectedNode && !selectedEdge && <div className={styles.emptyInspector}>Select a node or arrow to edit it.</div>}
          </section>
          <section className={styles.inspectorSection}>
            <div className={styles.panelHeading}><span>NOTES</span><strong>Flow memory</strong></div>
            <textarea className={styles.notes} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What should this learning flow help someone discover?" />
            <div className={styles.notesMeta}>{flowStats.types} node types · {flowStats.branches} decision branches</div>
          </section>
          <section className={styles.inspectorSection}>
            <div className={styles.panelHeading}><span>MODEL</span><strong>Learning loop</strong></div>
            <p className={styles.modelCopy}>Every arrow is a causal claim. Every prediction can become an experiment. Every mismatch is a new question.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
