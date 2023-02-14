import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, Node, NodeChange, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";
import { create } from "zustand";

const initialNodes: Node<any>[] = [
    {
        id: '0',
        position: { x: 100, y: 100 },
        data: {},
        dragHandle: '.custom-drag-handle',
        type: 'denseNode'
    },
    {
        id: '1',
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
            edges: addEdge(connection, get().edges),
        });
    },
    createNode: (node: Node) => {
        set({
            nodes: get().nodes.concat(node),
        });
    },
    deleteNode: (id: string) => {
        set({
            nodes: get().nodes.filter(n => n.id != id),
        });
    }
}));

export default useGraph;