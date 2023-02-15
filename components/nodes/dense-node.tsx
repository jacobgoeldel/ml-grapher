import { useCallback } from 'react';
import { Handle, Node, Position } from 'reactflow';
import { Box, DarkMode, FormControl, FormLabel, HStack, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text, useColorMode } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons';
import useGraph from '../store';

const handleStyle = { width: 10, height: 10, top: "47%" };

type TextProp = {
  text: string;
};

function DenseNode(node: Node, data: TextProp) {
  const deleteNode = useGraph((state) => state.deleteNode);

  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  const onDeleteIcon = () => deleteNode(node.id);

  return (
    <Box borderRadius='sm' bg='#25293b' borderWidth={1} borderColor='gray.900' shadow='md' overflow='hidden' cursor="default">
      <HStack
        align="center"
        justify="space-between"
        p='1'
        pl='2'
        pr='2'
        bg='red.500'
        color='gray.50'
        lineHeight='tight'
        className="custom-drag-handle"
        cursor="move"
      >
        <Text fontWeight="semibold">Dense Layer</Text>
        <IconButton
          variant="unstyled"
          aria-label='delete node'
          onClick={onDeleteIcon}
          icon={<CloseIcon />}
          color="gray.200"
          _hover={{ color: "white" }} />
      </HStack>

      <Box p={2}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />

        <FormControl>
          <FormLabel color="white">Neurons</FormLabel>
          <NumberInput max={64} min={2} defaultValue={8} color="white">
            <NumberInputField backgroundColor="gray.800" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl mt={4} mb={2}>
          <FormLabel color="white">Activation Function</FormLabel>
          <Select defaultValue="ReLU" color="white" backgroundColor="gray.800">
            <option>ReLU</option>
            <option>Tanh</option>
            <option>Linear</option>
            <option>Sigmoid</option>
          </Select>
        </FormControl>
      </Box>

    </Box>
  );
}

export default DenseNode;