import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, Node, NodeChange, OnConnect, OnEdgesChange, OnNodesChange, updateEdge } from "reactflow";
import { create } from "zustand";

const initialNodes: Node<any>[] = [];
const initialEdges: Edge<any>[] = [];

// stores most of the app state
export type GraphState = {
    nodes: Node[];
    edges: Edge[];
    layerDefs: Map<string, any>;
    dataSets: Map<string, DataSet | undefined>;
    errors: ErrorMessage[];
    graphName: string;
    graphNet: any | undefined;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateEdge: (oldEdge: Edge, newConnection: Connection) => void;
    deleteEdge: (edge: Edge) => void;
    createNode: (node: Node) => void;
    deleteNode: (id: string) => void;
    setNodeData: (id: string, data: any) => void;
    setGraphName: (name: string) => void;
    setGraphNet: (graphNet: any | undefined) => void;
    setLayerDef: (nodeName: string, layer: any) => void;
    setDataSet: (nodeId: string, data: DataSet | undefined) => void;
    getDataSet: (nodeId: string) => DataSet | undefined;
    createMLGraph: () => GraphEnv | undefined;
    clearGraph: () => void;
    getGraphJson: () => any;
    loadGraphJson: (data: any) => void;
};

export type ErrorMessage = {
    type: string;
    msg: string;
}

export type DataSet = {
    fileName: string;
    cols: string[];
    data: any[];
}

export type GraphEnv = {
    data: number[][];
    labels: number[];
    graph: any[];
}

const useGraph = create<GraphState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    layerDefs: new Map(),
    dataSets: new Map(),
    graphName: "",
    graphNet: undefined,
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
        // check that the type of input and output match data<->data or nn<->nn
        if(connection.sourceHandle?.charAt(0) == connection.targetHandle?.charAt(0)) {
            set({
                edges: addEdge(connection, get().edges.filter(e => !(e.target == connection.target && e.targetHandle == connection.targetHandle) &&
                                                                   !(e.source == connection.source && e.sourceHandle == connection.sourceHandle))),
            });
    
            // run to test for errors
            get().createMLGraph();
        }
    },
    updateEdge: (oldEdge: Edge, newConnection: Connection) => {
        // check that the type of input and output match
        if(newConnection.sourceHandle?.charAt(0) == newConnection.targetHandle?.charAt(0)) {
            set({
                edges: updateEdge(oldEdge, newConnection, get().edges.filter(e => e.id == oldEdge.id! || (!(e.target == newConnection.target && e.targetHandle == newConnection.targetHandle) &&
                                                                                    !(e.source == newConnection.source && e.sourceHandle == newConnection.sourceHandle))))
            });

            // run to test for errors
            get().createMLGraph();
        }
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
    setNodeData: (id: string, data: any) => {
        const nodeIndex = get().nodes.findIndex(n => n.id == id);

        if(nodeIndex == -1)
            return;

        let nodes = get().nodes;
        nodes[nodeIndex].data = data;

        set({
            nodes
        });
    },
    setGraphName: (name) => {
        set({
            graphName: name
        });
    },
    setGraphNet: (graphNet) => {
        set({
            graphNet,
        });
    },
    setLayerDef: (nodeName: string, layer: any) => {
        set({
            layerDefs: get().layerDefs.set(nodeName, layer)
        });
    },
    setDataSet: (nodeId, data) => set({
        dataSets: get().dataSets.set(nodeId, data)
    }),
    getDataSet: (nodeId) => get().dataSets.get(nodeId),
    createMLGraph: () => {
        const graphStack: Node<any>[] = [];
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

        // check for multiple inputs
        if(get().nodes.filter(n => n.type == "inputNode").length > 1) {
            errors.push({type: "error", msg: "Cannot have more than one input node."});
            valid = false;
        }

        // check for multiple outputs
        if(get().nodes.filter(n => n.type == "outputNode").length > 1) {
            errors.push({type: "error", msg: "Cannot have more than one output node."});
            valid = false;
        }

        // check that data is given to input
        if(inputNode != undefined) {
            if(get().edges.filter(e => e.target == inputNode.id).length < inputNode.data.inputs) {
                errors.push({type: "error", msg: "Input Layer is missing data input(s)"});
                valid = false;
            }
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

                // check that output has data given to it
                if(outputNode != undefined) {
                    if(get().edges.filter(e => e.target == outputNode.id).length != 2) {
                        errors.push({type: "error", msg: "Output Layer is missing prediction data"});
                        set({ errors });
                        return undefined;
                    }
                }

                continue;
            }

            connection = get().edges.find(e => e.source == nextNode!.id);
        }

        // verify we have a complete graph
        
        if(graphStack[graphStack.length - 1].type != "outputNode") {
            errors.push({type: "error", msg: "Graph must have a path between the input and output nodes."});
        } else {
            // warnings based on graph size
            if(graphStack.length < 4) {
                errors.push({type: "warning", msg: "Graph is small and may not adequately train."});
            }
    
            if(graphStack.length > 10) {
                errors.push({type: "warning", msg: "Graph is large and may train slowly."});
            }
        }

        set({ errors });

        // one last verify for valid graphs, then return training environment
        if(graphStack.length > 2 && graphStack[graphStack.length - 1].type == "outputNode") {
            return {
                data: inputNode!.data.inputData,
                labels: outputNode!.data.outputData,
                graph: graphStack.map(n => get().layerDefs.get(n.id))
            };
        }

        return undefined;
    },
    clearGraph: () => {
        set({
            nodes: [],
            edges: [],
            layerDefs: new Map(),
            graphName: "",
            errors: [],
        });

        get().createMLGraph();
    },
    getGraphJson: () => {
        return {
            nodes: get().nodes,
            edges: get().edges,
            graphName: get().graphName,
            dataSets: get().dataSets,
        }
    },
    loadGraphJson: (data: any) => {
        set({
            nodes: data.nodes,
            edges: data.edges,
            graphName: data.graphName,
            dataSets: data.dataSets,
        });

        get().createMLGraph();
    }
}));

export default useGraph;