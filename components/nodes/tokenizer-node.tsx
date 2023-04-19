import { Connection, Edge, Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import DefaultNode, { NodeData } from './base-node';
import { Button, HStack, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import useGraph, { DataSet } from '../store';
import { useEffect, useState } from 'react';

const handleStyle = { width: 12, height: 12 };

const TokenizerNode = (node: Node, data: NodeData) => {
    const [edge, setEdge] = useState<Edge | undefined>();
    const [tokens, setTokens] = useState<Map<string, number>>();
    const [tokenCount, setTokenCount] = useState<number>(0);
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
                const newColname: string = newEdge.sourceHandle!.substring(2);

                // get every possible value
                let newTokens = new Map<string, number>();
                prevData!.data.forEach(d => {
                    newTokens.set(d[newColname], 0);
                });

                // assign each unique value a token
                let tokenId = 0;
                for (let key of newTokens.keys()) {
                    newTokens.set(key, tokenId);
                    tokenId++;
                }
                
                // build dataset
                const newData: DataSet = {
                    fileName: "Tokenizer",
                    cols: ["tokenizedData"],
                    data: prevData!.data.map((val) => {
                        return {
                            "tokenizedData": newTokens.get(val[newColname])
                        }
                    })
                }

                setTokens(newTokens);
                setTokenCount(tokenId);
                setDataSet(node.id, newData);

                updateNodeInternals(node.id);
            } else {
                setTokens(new Map());
                setTokenCount(0);
                setDataSet(node.id, undefined);

                updateNodeInternals(node.id);
            }
        }
    }, [edges]);

    return (
        <DefaultNode node={node} data={data} title="Data Tokenizer" titleColor="green.500">
            <Handle 
                type="source" 
                position={Position.Right} 
                style={{ ...handleStyle, top: 70, backgroundColor: "var(--chakra-colors-green-700)" }} 
                key={0}
                id="d_tokenizedData"
            />
            
            <Handle 
                type="target" 
                id="d_input"
                position={Position.Left} 
                style={{ ...handleStyle, top: 70, backgroundColor: "var(--chakra-colors-green-700)" }} 
                key={1} 
            />

            <Text color="white" pl={2}>{tokenCount} Tokens</Text>
            <LightMode>
                <Button onClick={onOpen} colorScheme='green' w="100%" mt={4}>View</Button>
            </LightMode>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>

                    <ModalHeader color="white">Tokens</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color="white">
                        { tokens &&
                            <>
                                {Array.from(tokens!.entries()).map(val => (
                                    <HStack>
                                        <Text fontWeight="bold">{val[1]}:</Text>
                                        <Text>"{val[0]}"</Text>
                                    </HStack>
                                ))}
                            </>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </DefaultNode>
    );
}

export default TokenizerNode;