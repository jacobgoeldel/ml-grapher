import { Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import { Box, Button, FormControl, FormLabel, HStack, Input, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import DefaultNode, { NodeData } from './base-node';
import Papa from "papaparse";
import { useRef, useState } from 'react';
import { DataTable } from '../DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import useGraph from '../store';

const handleStyle = { width: 12, height: 12 };

const DataNode = (node: Node, data: NodeData) => {
    const [dataSet, setDataSet] = useState<any[][] | undefined>(node.data.dataSet || undefined);
    const [columns, setColumns] = useState<any[]>(node.data.columns || undefined);
    const updateNodeInternals = useUpdateNodeInternals();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const columnHelper = createColumnHelper<any>();
    const [fileName, setFileName] = useState(node.data.fileName || "");

    const { setLayerDef, setNodeData } = useGraph((state) => ({
        setLayerDef: state.setLayerDef,
        setNodeData: state.setNodeData
    }));

    const inputRef = useRef<HTMLInputElement>(null);

    const uploadClicked = () => inputRef?.current?.click();

    const loadData = (e: any) => {
        const files = e.target.files;
        if (files) {
            Papa.parse(files[0], {
                complete: function (results: any) {
                    setFileName(files[0].name);
                    console.log(results);
                    setDataSet(results.data);

                    const newCols = results.meta.fields.map((c: string, i: number) => columnHelper.accessor(c, { header: c, id: `${i}` }));
                    console.log(newCols);
                    setColumns(newCols);

                    setNodeData(node.id, {
                        dataSet: results.data,
                        columns: newCols,
                        fileName: files[0].name
                    });

                    updateNodeInternals(node.id);
                },
                header: true
            });
        }
    }

    return (
        <DefaultNode node={node} data={data} title="Data Upload" titleColor="green.500">

            <>
                {dataSet && columns.map((c: any, i: number) => (
                    <Handle type="source" position={Position.Right} style={{ ...handleStyle, top: 230 + i * 40, backgroundColor: "var(--chakra-colors-green-700)" }} key={i} id={`target-handle-${i + 1}`} />
                ))
                }
            </>

            <FormControl>
                <Input
                    style={{ display: "none" }}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={loadData}
                    ref={inputRef}
                />
                <LightMode>
                    <HStack p={4} spacing={10} justifyContent="space-between">
                        <Text color="white">{fileName}</Text>
                        <Button colorScheme="green" onClick={uploadClicked}>
                            Upload File
                        </Button>
                    </HStack>
                </LightMode>
            </FormControl>

            <>
                {dataSet &&
                    <LightMode>
                        <Box p={4}>
                            <Button width="full" colorScheme="green" onClick={onOpen}>View Data</Button>
                        </Box>
                    </LightMode>
                }
            </>

            <>
                {dataSet && columns.map((c: any) => (
                    <Text color="white" mt={4} mr={2} textAlign="right" key={c.header}>"{c.header}"</Text>
                ))}
            </>

            <>
                {dataSet &&
                    <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl" scrollBehavior='inside'>
                        <ModalOverlay />
                        <ModalContent>

                            <ModalHeader color="white">Data Set</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody color="white">
                                <DataTable columns={columns} data={dataSet} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                }
            </>
        </DefaultNode>
    );
}

export default DataNode;