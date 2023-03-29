import { Handle, Node, Position } from 'reactflow';
import { useState, useEffect } from 'react';
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select } from '@chakra-ui/react';
import DefaultNode, { NodeData } from './base-node';
import useGraph from '../store';

const handleStyle = { width: 12, height: 12, top: "47%", backgroundColor: "var(--chakra-colors-red-700)" };

const DenseNode = (node: Node) => {
    const { setLayerDef, setNodeData } = useGraph((state) => ({
        setLayerDef: state.setLayerDef,
        setNodeData: state.setNodeData
    }));

    const [num_neurons, setNeurons] = useState(node.data.neurons || 8);
    const [activation, setActivation] = useState(node.data.activation || "relu");

    const onNeuronsChanged = (_: string, val: number) => setNeurons(val);
    const onActivationChanged = (evt: any) => setActivation(evt.target.value);

    const updateData = () => setNodeData(node.id, {
        neurons: num_neurons,
        activation
    });

    useEffect(() => {
        setLayerDef(node.id, { type: 'fc', num_neurons, activation });
        updateData();
    }, [num_neurons, activation]);

    return (
        <DefaultNode node={node} data={node.data} title="Dense Layer" titleColor="red.500">
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Right} style={handleStyle} />

            <FormControl>
                <FormLabel color="white">Neurons</FormLabel>
                <NumberInput max={64} min={2} value={num_neurons} onChange={onNeuronsChanged} color="white">
                    <NumberInputField backgroundColor="gray.800" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl mt={4} mb={2}>
                <FormLabel color="white">Activation Function</FormLabel>
                <Select value={activation} onChange={onActivationChanged} color="white" backgroundColor="gray.800">
                    <option value="relu">ReLU</option>
                    <option value="tanh">Tanh</option>
                    <option value="maxout">Maxout</option>
                    <option value="sigmoid">Sigmoid</option>
                </Select>
            </FormControl>
        </DefaultNode>
    );
}

export default DenseNode;