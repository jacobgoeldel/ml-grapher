import { useCallback } from 'react';
import { Handle, Node, Position } from 'reactflow';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons';
import useGraph from '../store';

const handleStyle = { left: 10 };

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
        <Input placeholder='Basic usage' borderRadius="sm" value={data.text} onChange={onChange} />
      </Box>

      <Handle type="source" position={Position.Right} />
    </Box>
  );
}

export default DenseNode;