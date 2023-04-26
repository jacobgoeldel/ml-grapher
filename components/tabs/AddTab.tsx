import { Box, Button, LightMode, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

const AddTab: FC<{ visible: boolean }> = ({ visible }) => {
    const onDragStart = (event: any, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Box hidden={!visible} h="full">
        <LightMode>
            <VStack h="full" w="400px" backgroundColor="gray.800" p={12} spacing={12} dropShadow="lg" alignItems="start">
                <Text fontSize='4xl' color="white" h="min">Nodes</Text>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Data Nodes</Text>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="green" onDragStart={(event) => onDragStart(event, 'dataNode')} draggable width="full" cursor="grab">Data Upload</Button>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="green" onDragStart={(event) => onDragStart(event, 'tokenizerNode')} draggable width="full" cursor="grab">Tokenizer</Button>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="green" onDragStart={(event) => onDragStart(event, 'normalizerNode')} draggable width="full" cursor="grab">Normalize</Button>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="green" onDragStart={(event) => onDragStart(event, 'onehotNode')} draggable width="full" cursor="grab">One Hot Encoder</Button>
                </VStack>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Neural Network Nodes</Text>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="red" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable width="full" cursor="grab">Input Layer</Button>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="red" onDragStart={(event) => onDragStart(event, 'denseNode')} draggable width="full" cursor="grab">Dense Layer</Button>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="red" onDragStart={(event) => onDragStart(event, 'outputNode')} draggable width="full" cursor="grab">Output Layer</Button>
                </VStack>

                <VStack w="full" spacing={4} alignItems="start">
                    <Text fontSize='xl' color="white" h="min">Utility Nodes</Text>
                    <Button justifyContent="flex-start" borderRadius='sm' py={2} colorScheme="blue" onDragStart={(event) => onDragStart(event, 'commentNode')} draggable width="full" cursor="grab">Comment</Button>
                </VStack>
            </VStack>
        </LightMode>
        </Box>
    )
}

export default AddTab;