import { Button, LightMode, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

const AddTab: FC<{}> = () => {
    const onDragStart = (event: any, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <LightMode>
            <VStack h="full" w="400px" backgroundColor="gray.800" p={8} spacing={12} dropShadow="lg" alignItems="start">
                <Text fontSize='4xl' color="white" h="min">Nodes</Text>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Data Nodes</Text>
                    <Button colorScheme="green" onDragStart={(event) => onDragStart(event, 'dataNode')} draggable width="full">Data Upload</Button>
                    <Button colorScheme="green" onDragStart={(event) => onDragStart(event, 'tokenizerNode')} draggable width="full">Data Tokenizer</Button>
                    <Button colorScheme="green" onDragStart={(event) => onDragStart(event, 'normalizerNode')} draggable width="full">Data Normalizer</Button>
                </VStack>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Neural Network Nodes</Text>
                    <Button colorScheme="red" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable width="full">Input Layer</Button>
                    <Button colorScheme="red" onDragStart={(event) => onDragStart(event, 'denseNode')} draggable width="full">Dense Layer</Button>
                    <Button colorScheme="red" onDragStart={(event) => onDragStart(event, 'outputNode')} draggable width="full">Output Layer</Button>
                </VStack>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Utility Nodes</Text>
                    <Button colorScheme="blue" onDragStart={(event) => onDragStart(event, 'commentNode')} draggable width="full">Comment</Button>
                </VStack>
            </VStack>
        </LightMode>
    )
}

export default AddTab;