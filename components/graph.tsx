import { Flex, HStack } from '@chakra-ui/react';
import { MutableRefObject, RefObject, useCallback, useRef, useState } from 'react';
import ReactFlow, { Controls, Background, Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, ReactFlowInstance, ReactFlowProvider, useReactFlow, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import DataNode from './nodes/data-node';
import DenseNode from './nodes/dense-node';
import InputNode from './nodes/input-node';
import OutputNode from './nodes/output-node';
import SideBar from './sidebar';
import useGraph, { GraphState } from './store';


const nodeTypes: any = { 
    denseNode: DenseNode, 
    inputNode: InputNode, 
    outputNode: OutputNode,
    dataNode: DataNode,
 };

const selector = (state: GraphState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    createNode: state.createNode,
    deleteEdge: state.deleteEdge,
    updateEdge: state.updateEdge,
});

const Graph = () => {
    const reactFlowInstance = useReactFlow();
    const reactFlowWrapper = useRef<any | null>(null);

    const edgeUpdateSuccessful = useRef(true);
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, createNode, deleteEdge, updateEdge } = useGraph(selector);

    let id = 0;
    const getId = () => `dndnode_${id++}`;

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper!.current!.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance!.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
                dragHandle: '.custom-drag-handle',
            };

            createNode(newNode);
        },
        [reactFlowInstance]
    );

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
        edgeUpdateSuccessful.current = true;
        updateEdge(oldEdge, newConnection);
    }, []);

    const onEdgeUpdateEnd = useCallback((_: any, edge: Edge) => {
        if (!edgeUpdateSuccessful.current) {
            deleteEdge(edge);
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    return (
        <Flex grow={1} w="full" h="full">
            <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: "100%" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onEdgeUpdateStart={onEdgeUpdateStart}
                    onEdgeUpdate={onEdgeUpdate}
                    onEdgeUpdateEnd={onEdgeUpdateEnd}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <Background color='#383B56' size={1.5} />
                    <Controls />
                </ReactFlow>
            </div>
        </Flex>
    );
}

export default Graph;