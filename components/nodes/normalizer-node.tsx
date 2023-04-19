import { Connection, Edge, Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import DefaultNode, { NodeData } from './base-node';
import { Button, HStack, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import useGraph, { DataSet } from '../store';
import { useEffect, useState } from 'react';

const handleStyle = { width: 12, height: 12 };

const NormalizerNode = (node: Node, data: NodeData) => {
    const [edge, setEdge] = useState<Edge | undefined>();
    const updateNodeInternals = useUpdateNodeInternals();
    const [max, setMax] = useState<number | undefined>(node.data.max);
    const [min, setMin] = useState<number | undefined>(node.data.min);

    const { getDataSet, setDataSet, setNodeData, edges } = useGraph((state) => ({
        getDataSet: state.getDataSet,
        setDataSet: state.setDataSet,
        setNodeData: state.setNodeData,
        edges: state.edges,
    }));

    useEffect(() => {
        const newEdge = edges.find(e => e.target == node.id);
        if(newEdge != edge) {
            setEdge(newEdge);

            if(newEdge != undefined) {
                const prevData = getDataSet(newEdge.source);
                const newColname: string = newEdge.sourceHandle!;

                // get the max and min values
                let newMax: number | undefined;
                let newMin: number | undefined;
                prevData!.data.forEach(d => {
                    const val = parseInt(d[newColname]);

                    if(newMax == undefined || val > newMax)
                        newMax = val;
                    if(newMin == undefined || val < newMin)
                        newMin = val;
                });
                
                // build dataset
                const range = newMax! - newMin!;
                const newData: DataSet = {
                    fileName: "Normalizer",
                    cols: ["normalizedData"],
                    data: prevData!.data.map((val) => {
                        return {
                            "normalizedData": (parseFloat(val[newColname]) - newMin!) / range,
                        }
                    })
                }

                setDataSet(node.id, newData);
                setMax(newMax);
                setMin(newMin);
                setNodeData(node.id, { min: newMin, max: newMax });

                updateNodeInternals(node.id);
            } else {
                setDataSet(node.id, undefined);
                setMax(undefined);
                setMin(undefined);
                setNodeData(node.id, { min: undefined, max: undefined });

                updateNodeInternals(node.id);
            }
        }
    }, [edges]);

    return (
        <DefaultNode node={node} data={data} title="Data Normalizer" titleColor="green.500">
            <Handle 
                type="source" 
                position={Position.Right} 
                style={{ ...handleStyle, top: 70, backgroundColor: "var(--chakra-colors-green-700)" }} 
                key={0}
                id="normalizedData"
            />
            
            <Handle 
                type="target" 
                position={Position.Left} 
                style={{ ...handleStyle, top: 70, backgroundColor: "var(--chakra-colors-green-700)" }} 
                key={1} 
            />

            <Text color="white" pl={2}>Min: {min ?? ""}</Text>
            <Text color="white" pl={2}>Max: {max ?? ""}</Text>
        </DefaultNode>
    );
}

export default NormalizerNode;