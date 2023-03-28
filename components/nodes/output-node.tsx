import { Handle, Node, Position } from 'reactflow';
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from '@chakra-ui/react';
import DefaultNode, { NodeData } from './base-node';
import { useState, useEffect } from 'react';
import useGraph from '../store';

const handleStyle = { width: 12, height: 12 };

const OutputNode = (node: Node, data: NodeData) => {
    const [outputType, setOutputType] = useState("Classifier");
    const [classes, setClasses] = useState(2);
    const [activation, setActivation] = useState("softmax");

    const setLayer = useGraph((state) => state.setLayerDef);

    const onTypeChanged = (evt: any) => setOutputType(evt.target.value);
    const onClassesChanged = (_: string, val: number) => setClasses(val);
    const onActivationChanged = (evt: any) => setActivation(evt.target.value);

    useEffect(() => {
        setLayer(node.id, outputType == "Classifier" ? { type: activation, num_classes: classes } : { type:'regression', num_neurons: 3 });
    }, [outputType, classes, activation]);

    return (
        <DefaultNode node={node} data={data} title="Output Layer" titleColor="red.500">
            <Handle type="target" position={Position.Left} id="layer" style={{ ...handleStyle, top: "128px", backgroundColor: "var(--chakra-colors-red-700)" }} />
            <Handle type="target" position={Position.Left} id="data" style={{ ...handleStyle, top: "342px", backgroundColor: "var(--chakra-colors-green-700)" }} />

            <FormControl mt={4} mb={2}>
                <FormLabel color="white">Activation Function</FormLabel>
                <Select value={outputType} onChange={onTypeChanged} color="white" backgroundColor="gray.800">
                    <option>Classifier</option>
                    <option>Regression</option>
                </Select>
            </FormControl>

            <FormControl isDisabled={outputType != "Classifier"}>
                <FormLabel color="white">Classes</FormLabel>
                <NumberInput max={64} min={2} value={classes} onChange={onClassesChanged} color="white">
                    <NumberInputField backgroundColor="gray.800" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl mt={4} mb={2} isDisabled={outputType != "Classifier"}>
                <FormLabel color="white">Activation Function</FormLabel>
                <Select value={activation} onChange={onActivationChanged} color="white" backgroundColor="gray.800">
                    <option>softmax</option>
                    <option>svm</option>
                </Select>
            </FormControl>

            <Text mt={4} mb={2} color="white">Predict</Text>
        </DefaultNode>
    );
}

export default OutputNode;