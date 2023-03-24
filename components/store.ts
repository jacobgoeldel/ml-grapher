import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, Node, NodeChange, OnConnect, OnEdgesChange, OnNodesChange, updateEdge } from "reactflow";
import { create } from "zustand";
import { NodeData } from "./nodes/base-node";

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
    layerDefs: Map<string, any>;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateEdge: (oldEdge: Edge, newConnection: Connection) => void;
    deleteEdge: (edge: Edge) => void;
    createNode: (node: Node) => void;
    deleteNode: (id: string) => void;
    setLayerDef: (nodeName: string, layer: any) => void;
    createMLGraph: () => any[] | undefined;
};

const useGraph = create<GraphState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    layerDefs: new Map(),
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
    setLayerDef: (nodeName: string, layer: any) => {
        set({
            layerDefs: get().layerDefs.set(nodeName, layer)
        });
    },
    createMLGraph: () => {
        const graphStack: Node<NodeData>[] = [];
        const inputNode = get().nodes.find(n => n.type == "inputNode");

        // no input
        if(inputNode == undefined)
            return undefined;

        graphStack.push(inputNode);

        let connection = get().edges.find(e => e.source == inputNode.id);
        while(connection != undefined) {
            let nextNode = get().nodes.find(n => n.id == connection!.target);

            // graph has no output, exit
            if(nextNode == undefined) {
                return undefined;
            }

            graphStack.push(nextNode);

            // graph is complete
            if(nextNode.type == "outputNode") {
                connection = undefined;
                continue;
            }

            connection = get().edges.find(e => e.source == nextNode!.id);
        }

        // verify we have a complete graph
        if(graphStack.length > 2 && graphStack[graphStack.length - 1].type == "outputNode") {
            return graphStack.map(n => get().layerDefs.get(n.id));
        }

        return undefined;
    }
}));

export default useGraph;