import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Box } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react'

const handleStyle = { left: 10 };

type TextProp = {
  text: string;
};

function TextNode(data: TextProp) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
      <Box borderRadius='sm' bg='gray.700' overflow='hidden'>
        <Box
          p='1'
          pl='4'
          bg='red.700'
          color='gray.50'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          Text
        </Box>
      
        <Box p={2}>
          <Input placeholder='Basic usage' borderRadius="sm" value={data.text} onChange={onChange} />
        </Box>
      
      <Handle type="source" position={Position.Right} />
      </Box>
  );
}

export default TextNode;