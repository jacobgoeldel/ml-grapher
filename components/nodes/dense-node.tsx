import { Handle, Node, Position } from 'reactflow';
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select } from '@chakra-ui/react';
import DefaultNode from './base-node';

const handleStyle = { width: 12, height: 12, top: "47%" };

type TextProp = {
    text: string;
};

const DenseNode = (node: Node, data: TextProp) => {
    return (
        <DefaultNode node={node} data={data} title="Dense Layer" titleColor="red.500">
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
        </DefaultNode>
    );
}

export default DenseNode;