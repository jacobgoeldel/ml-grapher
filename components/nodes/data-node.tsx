import { Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import { Box, Button, FormControl, FormLabel, HStack, Input, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import DefaultNode, { NodeData } from './base-node';
import Papa from "papaparse";
import { useRef, useState } from 'react';
import { DataTable } from '../DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import useGraph, { DataSet } from '../store';

const handleStyle = { width: 12, height: 12 };


const DataNode = (node: Node, data: NodeData) => {
    const { setDataSet, getDataSet } = useGraph((state) => ({
        setDataSet: state.setDataSet,
        getDataSet: state.getDataSet,
    }));

    const dataSet = getDataSet(node.id);
    const columnHelper = createColumnHelper<any>();

    const stringToCols = (c: string, i: number) => columnHelper.accessor(c, { header: c, id: `${i}` });

    const [columns, setColumns] = useState<any[]>(dataSet?.cols.map(stringToCols) || []);
    const updateNodeInternals = useUpdateNodeInternals();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const inputRef = useRef<HTMLInputElement>(null);
    const uploadClicked = () => inputRef?.current?.click();

    const loadData = (e: any) => {
        const files = e.target.files;
        if (files) {
            Papa.parse(files[0], {
                complete: function (results: any) {
                    const newCols = results.meta.fields.map(stringToCols);

                    const newSet: DataSet = {
                        fileName: files[0].name,
                        cols: results.meta.fields,
                        data: results.data
                    };

                    setColumns(newCols);
                    setDataSet(node.id, newSet);

                    updateNodeInternals(node.id);
                },
                header: true
            });
        }
    }

    return (
        <DefaultNode node={node} data={data} title="Data Upload" titleColor="green.500">

            <>
                {dataSet && dataSet.cols.map((c: any, i: number) => (
                    <Handle type="source" position={Position.Right} style={{ ...handleStyle, top: 230 + i * 40, backgroundColor: "var(--chakra-colors-green-700)" }} key={i} id={`d_${c}`} />
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
                        <Text color="white">{dataSet?.fileName ?? ""}</Text>
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
                {dataSet && dataSet.cols.map((c: any) => (
                    <Text color="white" mt={4} mr={2} textAlign="right" key={c}>"{c}"</Text>
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
                                <DataTable columns={columns} data={dataSet.data} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                }
            </>
        </DefaultNode>
    );
}

export default DataNode;