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
    errors: ErrorMessage[];
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

export type ErrorMessage = {
    type: string;
    msg: string;
}

const useGraph = create<GraphState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    layerDefs: new Map(),
    errors: [],
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

        // run to test for errors
        get().createMLGraph();
    },
    updateEdge: (oldEdge: Edge, newConnection: Connection) => {
        set({
            edges: updateEdge(oldEdge, newConnection, get().edges)
        });

        // run to test for errors
        get().createMLGraph();
    },
    deleteEdge: (edge: Edge) => {
        set({
            edges: get().edges.filter((e) => e.id !== edge.id)
        });

        // run to test for errors
        get().createMLGraph();
    },
    createNode: (node: Node) => {
        set({
            nodes: get().nodes.concat(node),
        });

        // run to test for errors
        get().createMLGraph();
    },
    deleteNode: (id: string) => {
        set({
            nodes: get().nodes.filter(n => n.id != id),
            edges: get().edges.filter(e => e.sourceHandle != id || e.targetHandle != id)
        });

        // run to test for errors
        get().createMLGraph();
    },
    setLayerDef: (nodeName: string, layer: any) => {
        set({
            layerDefs: get().layerDefs.set(nodeName, layer)
        });
    },
    createMLGraph: () => {
        const graphStack: Node<NodeData>[] = [];
        const inputNode = get().nodes.find(n => n.type == "inputNode");
        let errors: ErrorMessage[] = [];

        let valid = true;
        // no input
        if(inputNode == undefined) {
            errors.push({type: "error", msg: "Missing input node."});
            valid = false;
        }

        // exit if there is no output node
        const outputNode = get().nodes.find(n => n.type == "outputNode");
        if(outputNode == undefined) {
            errors.push({type: "error", msg: "Missing output node."});
            valid = false;
        }

        // check for multiple inputs or outputs
        if(get().nodes.filter(n => n.type == "inputNode").length > 1) {
            errors.push({type: "error", msg: "Cannot have more than one input node."});
            set({ errors });
        }

        if(get().nodes.filter(n => n.type == "outputNode").length > 1) {
            errors.push({type: "error", msg: "Cannot have more than one output node."});
            set({ errors });
        }

        if(valid == false) {
            set({ errors });
            return undefined;
        }

        graphStack.push(inputNode!);

        let connection = get().edges.find(e => e.source == inputNode!.id);
        while(connection != undefined) {
            let nextNode = get().nodes.find(n => n.id == connection!.target);

            // graph has no output, exit
            if(nextNode == undefined) {
                errors.push({type: "error", msg: "Graph does not end with a output node."});
                set({ errors });
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
        
        if(graphStack[graphStack.length - 1].type != "outputNode") {
            errors.push({type: "error", msg: "Graph has to path between input and output nodes."});
        } else {
            if(graphStack.length < 4) {
                errors.push({type: "warning", msg: "Graph is small and may not adequately train."});
            }
    
            if(graphStack.length > 10) {
                errors.push({type: "warning", msg: "Graph is large and may train slowly."});
            }
        }

        set({ errors });

        if(graphStack.length > 2 && graphStack[graphStack.length - 1].type == "outputNode") {
            return graphStack.map(n => get().layerDefs.get(n.id));
        }

        return undefined;
    }
}));

export default useGraph;