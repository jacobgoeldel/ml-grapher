import { Flex, HStack } from '@chakra-ui/react';
import { MutableRefObject, RefObject, useCallback, useRef, useState } from 'react';
import ReactFlow, { Controls, Background, Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, ReactFlowInstance, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import DenseNode from './nodes/dense-node';
import SideBar from './sidebar';

const initialNodes: Node<any>[] = [
    {
        id: '0',
        position: { x: 100, y: 100 },
        data: {},
        type: 'denseNode'
    },
    {
        id: '1',
        position: { x: 400, y: 100 },
        data: {},
        type: 'denseNode'
    },
];

const initialEdges: Edge<any>[] = [];

const nodeTypes: any = { denseNode: DenseNode };

const Graph = () => {
    const reactFlowInstance = useReactFlow();
    const reactFlowWrapper = useRef<any | null>(null);

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds.filter(e => e.target != params.target))), []);

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
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    return (
        <Flex grow={1} w="full" h="full">
            <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: "100%" }}>
                <ReactFlow
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    onEdgesChange={onEdgesChange}
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