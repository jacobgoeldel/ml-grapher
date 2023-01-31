import { useCallback, useMemo, useState } from 'react';
import ReactFlow, { Controls, Background, Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import TextNode from './nodes/text-node';

const initialNodes: Node<any>[] = [
    {
        id: '0',
        position: { x: 100, y: 100 },
        data: {  },
        type: 'textNode'
    },
    {
        id: '1',
        position: { x: 400, y: 100 },
        data: {  },
        type: 'textNode'
    },
];

const initialEdges: Edge<any>[] = [];

const nodeTypes: any = { textNode: TextNode };

const Graph = () => {
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

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
            <Background color='#383B56' size={1.5}/>
            <Controls />
        </ReactFlow>
        </div>
    );
}

export default Graph;