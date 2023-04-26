import { Alert, AlertIcon, AlertTitle, Box, Button, DarkMode, FormControl, FormLabel, LightMode, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Select, Text, VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import useGraph from "../store";
import { Vol, Net } from "convnetjs";
import { Node } from "reactflow";

interface PredictValue {
    nodeId: string;
    label: string;
    nodeType: string;
    data: any;
    value: string | undefined;
}

const normalize = (x: number, min: number, max: number) => ((x - min) / (max - min) * 2) - 1
const denormalize = (x: number, min: number, max: number) => (max - min * (x + 1)) / 2 + min;

const PredictTab: FC<{ visible: boolean }> = ({ visible }) => {
    const [canPredict, setCanPredict] = useState(false);
    const [net, setNet] = useState<any | undefined>();
    const [dataEntries, setDataEntries] = useState<PredictValue[]>([]);
    const [lastPrediction, setLastPrediction] = useState<string | undefined>();

    const { graphNet, edges, nodes, dataSets } = useGraph((state) => ({
        graphNet: state.graphNet,
        edges: state.edges,
        nodes: state.nodes,
        dataSets: state.dataSets
    }));

    useEffect(() => {
        setCanPredict(graphNet != undefined);

        if (graphNet != undefined) {
            // build the inputs

            // find input node
            const inputNode = nodes.find((n: any) => n.type == "inputNode");

            if (inputNode != undefined) {
                const dataEdges = edges.filter(e => e.target == inputNode.id);

                setDataEntries(dataEdges.map(e => {
                    const dataNode = nodes.find(n => e.source == n.id);

                    if(dataNode!.type == "dataNode") { // data node stores column name in the handle id
                        return {
                            nodeId: e.source,
                            label: e.sourceHandle!.slice(2),
                            nodeType: dataNode!.type!,
                            data: dataNode!.data,
                            value: undefined
                        };
                    } else if(dataNode!.type == "onehotNode") {
                        return {
                            nodeId: e.source,
                            label: `${dataSets.get(dataNode!.id)!.cols[0]}: ${e.sourceHandle!.slice(2)}`,
                            nodeType: dataNode!.type!,
                            data: dataNode!.data,
                            value: "0"
                        };
                    } else { // other node types store the column name in dataset.col
                        return {
                            nodeId: e.source,
                            label: dataSets.get(dataNode!.id)!.cols[0],
                            nodeType: dataNode!.type!,
                            data: dataNode!.data,
                            value: undefined
                        };
                    }
                }));

                // Create the net
                let newNet = new Net();
                newNet.fromJSON(graphNet);
                setNet(newNet);
            }
        }
    }, [graphNet, edges]);

    const setOneHotValue = (nodeId: string, index: number) => {
        let newEntries = dataEntries;

        // reset all one hot data points from the same node to 0
        newEntries = newEntries.map(e => ({
            ...e,
            value: e.nodeId === nodeId ? "0" : e.value,
        }));

        // then the one selected
        newEntries[index].value = "1";

        setDataEntries(newEntries);
    }

    const setPredictionValue = (value: string | undefined, index: number) => {
        let newEntries = dataEntries;
        newEntries[index].value = value;
        setDataEntries(newEntries);
    }

    const onPredict = () => {
        const data = dataEntries.map(e => parseFloat(e.value ?? ""));
        const x = new Vol(1, 1, data.length);
        data.forEach((d, i) => x.w[i] = d);

        const scores = net.forward(x);

        const outputNode = nodes.find((n: any) => n.type == "outputNode");
        
        // get the node the label is coming from in order to reverse transformations
        const labelEdge = edges.find(e => e.target == outputNode!.id && e.targetHandle == "d_data");
        let labelNode: Node | undefined;
        if(labelEdge != undefined) {
            labelNode = nodes.find(n => n.id == labelEdge.source);
        }

        if(outputNode!.data.outputType == "Regression") {
            let val = scores.w[0];

            // if the regression value was normalized, unnormalize it
            if(labelNode && labelNode.type == "normalizerNode")
                val = denormalize(val, labelNode.data.min, labelNode.data.max);

            setLastPrediction(val.toLocaleString(undefined, { maximumFractionDigits: 3 }));
        } else { // Classifier
            // get the class with the highest value
            let result = scores.w.indexOf(Math.max(...scores.w));

            if(result == -1)
                setLastPrediction("Unknown");
            else {

                // output token instead of index if it's coming from a tokenizer
                if(labelNode && labelNode.type == "tokenizerNode") {
                    result = labelNode.data.tokens[result];
                }

                setLastPrediction(result);
            }
        }
    }

    return (
        <Box hidden={!visible} h="full">
            <LightMode>
                <VStack h="full" w="400px" backgroundColor="gray.800" p={8} spacing={12} dropShadow="lg" alignItems="start">
                    <Text fontSize='4xl' color="white" h="min">Predict</Text>

                    {canPredict ?
                        <>
                            {dataEntries.map((d,i) => (
                                <DarkMode key={i}>
                                    <FormControl key={d.label}>

                                        {d.nodeType == "dataNode" &&
                                            <>
                                                <FormLabel color="white">
                                                    {d.label}
                                                </FormLabel>
                                                <NumberInput color="white" onChange={(val) => setPredictionValue(val, i)}>
                                                    <NumberInputField backgroundColor="gray.900" />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </>
                                        }

                                        {d.nodeType == "tokenizerNode" &&
                                            <>
                                                <FormLabel color="white">
                                                    {d.label}
                                                </FormLabel>
                                                <Select defaultValue={0} onChange={(val) => setPredictionValue(val.currentTarget.value, i)} color="white" backgroundColor="gray.900">
                                                    {d.data.tokens.map((t: string, i: number) => <option value={i} key={i}>{t}</option>)}
                                                </Select>
                                            </>
                                        }

                                        {d.nodeType == "normalizerNode" &&
                                            <>
                                                <FormLabel color="white">
                                                    {d.label}
                                                </FormLabel>
                                                <NumberInput max={d.data.max} min={d.data.min} color="white" onChange={(_, numb) => setPredictionValue(normalize(numb, d.data.min, d.data.max).toString(), i)}>
                                                    <NumberInputField backgroundColor="gray.900" />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </>
                                        }

                                        {d.nodeType == "onehotNode" &&
                                        <RadioGroup onChange={(val) => setOneHotValue(d.nodeId, i)} value={d.value}>
                                            <Radio value="0" hidden={true} ></Radio>
                                            <Radio value="1" >
                                                <Text color="white" fontWeight="bold">{d.label}</Text>
                                            </Radio>
                                        </RadioGroup>
                                        }
                                    </FormControl>
                                </DarkMode>
                            ))}
                            <Button colorScheme="green" width="full" onClick={onPredict}>Predict</Button>

                            {lastPrediction != undefined &&
                                <Text fontSize='xl' color="white">Prediction: {lastPrediction}</Text>
                            }
                        </>
                        :
                        <Alert status="error" rounded="md">
                            <AlertIcon />
                            <AlertTitle>You must create a model in the training tab before predicting</AlertTitle>
                        </Alert>
                    }
                </VStack>
            </LightMode>
        </Box>
    )
}

export default PredictTab;