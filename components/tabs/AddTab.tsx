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
                <Text fontSize='4xl' color="white" h="min">Add Nodes</Text>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Data Nodes</Text>
                    <Button colorScheme="green" onDragStart={(event) => onDragStart(event, 'denseNode')} draggable width="full">CSV Input</Button>
                </VStack>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Neural Network Nodes</Text>
                    <Button colorScheme="red" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable width="full">Input Layer</Button>
                    <Button colorScheme="red" onDragStart={(event) => onDragStart(event, 'denseNode')} draggable width="full">Dense Layer</Button>
                </VStack>
            </VStack>
        </LightMode>
    )
}

export default AddTab;