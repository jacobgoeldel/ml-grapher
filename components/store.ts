import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, Node, NodeChange, OnConnect, OnEdgesChange, OnNodesChange, updateEdge } from "reactflow";
import { create } from "zustand";

const initialNodes: Node<any>[] = [
    {
        id: 'preset0',
        position: { x: 100, y: 100 },
        data: {},
        dragHandle: '.custom-drag-handle',
        type: 'denseNode'
    },
    {
        id: 'preset1',
        position: { x: 400, y: 100 },
        data: {},
        dragHandle: '.custom-drag-handle',
        type: 'denseNode'
    },
];

const initialEdges: Edge<any>[] = [];

export type GraphState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateEdge: (oldEdge: Edge, newConnection: Connection) => void;
    deleteEdge: (edge: Edge) => void;
    createNode: (node: Node) => void;
    deleteNode: (id: string) => void;
};

const useGraph = create<GraphState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges.filter(e => e.target != connection.target && e.source != connection.source)),
        });
    },
    updateEdge: (oldEdge: Edge, newConnection: Connection) => {
        set({
            edges: updateEdge(oldEdge, newConnection, get().edges)
        });
    },
    deleteEdge: (edge: Edge) => {
        set({
            edges: get().edges.filter((e) => e.id !== edge.id)
        })
    },
    createNode: (node: Node) => {
        set({
            nodes: get().nodes.concat(node),
        });
    },
    deleteNode: (id: string) => {
        set({
            nodes: get().nodes.filter(n => n.id != id),
            edges: get().edges.filter(e => e.sourceHandle != id || e.targetHandle != id)
        });
    },
}));

export default useGraph;