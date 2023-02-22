import { Handle, Node, Position } from 'reactflow';
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from '@chakra-ui/react';
import DefaultNode from './base-node';
import { useState } from 'react';

const handleStyle = { width: 12, height: 12 };

type TextProp = {
  text: string;
};

const OutputNode = (node: Node, data: TextProp) => {
  const [outputType, setOutputType] = useState("Classifier");

  const onTypeChanged = (evt: any) => setOutputType(evt.target.value);

  return (
    <DefaultNode node={node} data={data} title="Output Layer" titleColor="red.500">
      <Handle type="target" position={Position.Left} id="layer" style={{...handleStyle, top: "128px"}} />
      <Handle type="target" position={Position.Left} id="data" style={{...handleStyle, top: "342px"}} />

      <FormControl mt={4} mb={2}>
        <FormLabel color="white">Activation Function</FormLabel>
        <Select value={outputType} onChange={onTypeChanged} color="white" backgroundColor="gray.800">
          <option>Classifier</option>
          <option>Regression</option>
        </Select>
      </FormControl>

      <FormControl isDisabled={outputType != "Classifier"}>
        <FormLabel color="white">Classes</FormLabel>
        <NumberInput max={64} min={2} defaultValue={16} color="white">
          <NumberInputField backgroundColor="gray.800" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl mt={4} mb={2} isDisabled={outputType != "Classifier"}>
        <FormLabel color="white">Activation Function</FormLabel>
        <Select defaultValue="ReLU" color="white" backgroundColor="gray.800">
          <option>ReLU</option>
          <option>Tanh</option>
          <option>Linear</option>
          <option>Sigmoid</option>
        </Select>
      </FormControl>

      <Text mt={4} mb={2} color="white">Predict</Text>
    </DefaultNode>
  );
}

export default OutputNode;