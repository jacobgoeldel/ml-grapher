import { Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import { Box, Button, FormControl, FormLabel, Input, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import DefaultNode from './base-node';
import Papa from "papaparse";
import { useState } from 'react';
import { DataTable } from '../DataTable';
import { createColumnHelper } from '@tanstack/react-table';

const handleStyle = { width: 12, height: 12 };

type TextProp = {
    text: string;
};

const DataNode = (node: Node, data: TextProp) => {
    const [dataSet, setDataSet] = useState<any[][] | undefined>();
    const [columns, setColumns] = useState<any[]>([]);
    const updateNodeInternals = useUpdateNodeInternals();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const columnHelper = createColumnHelper<any>();

    const loadData = (e: any) => {
        const files = e.target.files;
        if (files) {
            Papa.parse(files[0], {
                complete: function (results: any) {
                    console.log(results);
                    setDataSet(results.data);

                    const newCols = results.meta.fields.map((c: string, i: number) => columnHelper.accessor(c, { header: c, id: `${i}` }));
                    console.log(newCols);
                    setColumns(newCols);
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
                    <Handle type="source" position={Position.Right} style={{ ...handleStyle, top: 198 + i * 40 }} key={i} id={`target-handle-${i + 1}`} />
                ))
                }
            </>

            <FormControl>
                <FormLabel color="white">File</FormLabel>
                <Input
                    style={{ paddingLeft: 0 }}
                    border={0}
                    color="white"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={loadData}
                />
            </FormControl>

            <>
                {dataSet &&
                    <LightMode>
                        <Button width="full" colorScheme="green" onClick={onOpen}>View Data</Button>
                    </LightMode>
                }
            </>

            <>
                {dataSet && columns.map((c: any) => (
                    <Text color="white" mt={4} mr={2} textAlign="right">"{c.header}"</Text>
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