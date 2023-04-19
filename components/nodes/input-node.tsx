import { useEffect, useState } from 'react';
import { Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from '@chakra-ui/react';
import DefaultNode, { NodeData } from './base-node';
import useGraph from '../store';

const handleStyle = { width: 12, height: 12 };

const InputNode = (node: Node, data: NodeData) => {
	const [inputs, setInputs] = useState(node.data.inputs || 1);
	const [targetArray, setTargetArray] = useState<number[]>(Array.from({ length: node.data.inputs || 0 }, (_, i) => i));
	const [inputData, setInputData] = useState<number[][]>(node.data.inputData || []);
	const updateNodeInternals = useUpdateNodeInternals();

	const { setLayerDef, setNodeData, edges, getDataSet } = useGraph((state) => ({
		edges: state.edges,
		getDataSet: state.getDataSet,
        setLayerDef: state.setLayerDef,
        setNodeData: state.setNodeData
    }));

	const inputsChanged = (_: string, val: number) => {
		setInputs(val);
		setTargetArray(Array.from({ length: val }, (_, i) => i));
		updateNodeInternals(node.id);
	}

	// update the model layer definition when # of inputs change
	useEffect(() => {
    	setLayerDef(node.id, { type: 'input', out_sx: 1, out_sy: 1, out_depth: inputs });
		setNodeData(node.id, { inputs, inputData });
	}, [inputs]);

	// update data when data sources change
	useEffect(() => {
		// TODO: check if the edges changed are for the input node before reloading data

		const dataEdges = edges.filter(e => e.target == node.id);

		// array of columns for each input data handle
		const data = dataEdges.map(e => {
			const edgeDataSet = getDataSet(e.source);

			if(edgeDataSet != undefined) {
				const column: string = e.sourceHandle!;
				return edgeDataSet.data.map(d => {
					let val = parseFloat(d[column]);
					return isNaN(val) ? 0 : val;
				});
			}

			return [];
		});

		setInputData(data);
		setNodeData(node.id, { inputs, inputData: data });
	}, [edges]);

	return (
		<DefaultNode node={node} data={data} title="Input Layer" titleColor="red.500">
			<>
				{targetArray.map(t => (
					<Handle type="target" position={Position.Left} style={{ ...handleStyle, top: 158 + t * 40, backgroundColor: "var(--chakra-colors-green-700)" }} key={t} id={`target-handle-${t + 1}`} />
				))}
			</>
			<Handle type="source" position={Position.Right} style={{ ...handleStyle, top: 110, backgroundColor: "var(--chakra-colors-red-700)" }} />

			<FormControl>
				<FormLabel color="white">Inputs</FormLabel>
				<NumberInput max={16} min={1} value={isNaN(inputs) ? "" : inputs} onChange={inputsChanged} color="white">
					<NumberInputField backgroundColor="gray.800" />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</FormControl>
			<>
				{targetArray.map(t => (
					<Text color="white" mt={4} ml={2} key={t}>Input {t + 1}</Text>
				))}
			</>
		</DefaultNode>
	);
}

export default InputNode;