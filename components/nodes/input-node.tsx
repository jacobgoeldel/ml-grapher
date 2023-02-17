import { useState } from 'react';
import { Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from '@chakra-ui/react';
import DefaultNode from './base-node';

const handleStyle = { width: 12, height: 12 };

type TextProp = {
	text: string;
};

const InputNode = (node: Node, data: TextProp) => {
	const [inputs, setInputs] = useState(1);
	const [targetArray, setTargetArray] = useState<number[]>([0]);
	const updateNodeInternals = useUpdateNodeInternals();

	const inputsChanged = (_: string, val: number) => {
		setInputs(val);
		setTargetArray(Array.from({ length: val }, (_, i) => i));
		updateNodeInternals(node.id);
	}

	return (
		<DefaultNode node={node} data={data} title="Input Layer" titleColor="red.500">
			<>
				{targetArray.map(t => (
					<Handle type="target" position={Position.Left} style={{ ...handleStyle, top: 158 + t * 40 }} key={t} id={`target-handle-${t + 1}`} />
				))}
			</>
			<Handle type="source" position={Position.Right} style={{ ...handleStyle, top: 110 }} />

			<FormControl>
				<FormLabel color="white">Inputs</FormLabel>
				<NumberInput max={16} min={1} value={inputs} onChange={inputsChanged} color="white">
					<NumberInputField backgroundColor="gray.800" />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</FormControl>
			<>
				{targetArray.map(t => (
					<Text color="white" mt={4} ml={2}>Input {t + 1}</Text>
				))}
			</>
		</DefaultNode>
	);
}

export default InputNode;