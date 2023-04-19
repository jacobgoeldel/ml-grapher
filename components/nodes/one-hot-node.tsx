import { Connection, Edge, Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import DefaultNode, { NodeData } from './base-node';
import { Box, Button, HStack, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import useGraph, { DataSet } from '../store';
import { useEffect, useState } from 'react';

const handleStyle = { width: 12, height: 12 };

const OnHotNode = (node: Node, data: NodeData) => {
    const [edge, setEdge] = useState<Edge | undefined>();
    const [tokens, setTokens] = useState<Map<string, number>>();
    const [tokenNames, setTokenNames] = useState<string[]>([]);
    const updateNodeInternals = useUpdateNodeInternals();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { getDataSet, setDataSet, edges } = useGraph((state) => ({
        getDataSet: state.getDataSet,
        setDataSet: state.setDataSet,
        edges: state.edges,
    }));

    useEffect(() => {
        const newEdge = edges.find(e => e.target == node.id);
        if(newEdge != edge) {
            setEdge(newEdge);

            if(newEdge != undefined) {
                const prevData = getDataSet(newEdge.source);
                const newColname: string = newEdge.sourceHandle!;

                // get every possible value
                let newTokens = new Map<string, number>();
                prevData!.data.forEach(d => {
                    newTokens.set(d[newColname], 0);
                });

                // assign each unique value a token
                let tokenId = 0;
                let newTokenNames: string[] = [];
                for (let key of newTokens.keys()) {
                    newTokens.set(key, tokenId);
                    newTokenNames.push(key);
                    tokenId++;
                }
                
                // build dataset
                const newData: DataSet = {
                    fileName: "Tokenizer",
                    cols: ["tokenizedData"],
                    data: prevData!.data.map((val) => {
                        let output: any = {};
                        newTokenNames.forEach(t => {
                            output[`ohe${t}`] = val[newColname] == t ? 1 : 0;
                        });

                        return output;
                    })
                }

                console.log(newData);

                setTokens(newTokens);
                setTokenNames(newTokenNames);
                setDataSet(node.id, newData);

                updateNodeInternals(node.id);
            } else {
                setTokens(new Map());
                setTokenNames([]);
                setDataSet(node.id, undefined);

                updateNodeInternals(node.id);
            }
        }
    }, [edges]);

    return (
        <DefaultNode node={node} data={data} title="One Hot Encode" titleColor="green.500">
            <Box minH="8">
                { tokenNames.map((k,i) => (
                    <>
                        <Handle
                            type="source" 
                            position={Position.Right} 
                            style={{ ...handleStyle, top: 70 + (i * 32), backgroundColor: "var(--chakra-colors-green-700)" }} 
                            key={k}
                            id={`ohe${k}`}
                            />
                        <Text color="white" pr={2} pb={2} align="right">"{k}"</Text>
                    </>
                ))
                
            }
                
                <Handle 
                    type="target" 
                    position={Position.Left} 
                    style={{ ...handleStyle, top: 70, backgroundColor: "var(--chakra-colors-green-700)" }} 
                    key={1} 
                    />
            </Box>
        </DefaultNode>
    );
}

export default OnHotNode;