import { Button, LightMode, Text, VStack, Icon, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, DarkMode, Input } from "@chakra-ui/react";
import exportFromJSON from "export-from-json";
import { FC, useRef } from "react";
import { TbFileImport, TbFileExport, TbFile } from 'react-icons/tb';
import useGraph from "../store";

const FileTab: FC<{}> = () => {
    const { isOpen: isNewModalOpen, onOpen: onNewModalOpen, onClose: onNewModalClose } = useDisclosure();

    const { clearGraph, graphName, setGraphName, getGraphJson, loadGraphJson } = useGraph((state) => ({ 
        clearGraph: state.clearGraph, 
        graphName: state.graphName, 
        setGraphName: state.setGraphName,
        getGraphJson: state.getGraphJson,
        loadGraphJson: state.loadGraphJson
    }));

    const newGraphClicked = () => {
        clearGraph();
        onNewModalClose();
    }

    const changeGraphname = (evt: any) => setGraphName(evt.target.value);

    const saveGraph = () => {
        exportFromJSON({ data: getGraphJson(), fileName: graphName, exportType: "json", extension: "mlgraph" });
    }

    const loadRef = useRef<HTMLInputElement>(null);

    const loadClicked = () => loadRef?.current?.click();

    const loadGraph = (e: any) => {
        const files = e.target.files;
        if (files) {
            var fileReader = new FileReader();
            fileReader.onload = function(e: any) {
                // load to graph state
                loadGraphJson(JSON.parse(e.target.result));
            };
            fileReader.readAsText(files[0]);
        } else {
            console.error("no files uploaded!");
        }
    }

    return (
        <>
            <LightMode>
                <VStack h="full" w="400px" backgroundColor="gray.800" p={8} spacing={12} dropShadow="lg" alignItems="start">
                    <Text fontSize='4xl' color="white" h="min">Files</Text>

                    <Flex alignItems="center" justifyContent="space-between" width="full">
                        <Text color="white" flex={1}>File Name:</Text>
                        <DarkMode>
                            <Input color="white" backgroundColor="gray.900" flex={2} value={graphName} onChange={changeGraphname} />
                        </DarkMode>
                    </Flex>

                    <VStack w="full" spacing={4} alignItems="start">
                        <Button onClick={onNewModalOpen} colorScheme="red" width="full" leftIcon={<Icon as={TbFile} w={8} h={8} />} justifyContent="start">New Graph</Button>
                        <Button onClick={saveGraph} colorScheme="blue" width="full" leftIcon={<Icon as={TbFileExport} w={8} h={8} />} justifyContent="start">Save Graph</Button>

                        <Input
                            style={{ display: "none" }}
                            type="file"
                            accept=".mlgraph"
                            onChange={loadGraph}
                            ref={loadRef}
                        />
                        <Button onClick={loadClicked} colorScheme="green" width="full" leftIcon={<Icon as={TbFileImport} w={8} h={8} />} justifyContent="start">Load Graph</Button>
                    </VStack>
                </VStack>
            </LightMode>

            <Modal isOpen={isNewModalOpen} onClose={onNewModalClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color="white">Confirm</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color="white">
                        Are you sure you want to make a new graph? All unsaved progress will be lost!
                    </ModalBody>

                    <ModalFooter>
                        <LightMode>
                            <Button colorScheme="red" mr={2} onClick={newGraphClicked}>Ok</Button>
                            <Button colorScheme='blue' mr={3} onClick={onNewModalClose}>
                                Cancel
                            </Button>
                        </LightMode>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default FileTab;