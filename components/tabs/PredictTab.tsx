import { Alert, AlertIcon, AlertTitle, Box, Button, DarkMode, FormControl, FormLabel, LightMode, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import useGraph from "../store";
import { Vol, Net } from "convnetjs";

interface PredictValue {
    label: string;
    nodeType: string;
    data: any;
    value: string | undefined;
}

const PredictTab: FC<{ visible: boolean }> = ({ visible }) => {
    const [canPredict, setCanPredict] = useState(false);
    const [net, setNet] = useState<any | undefined>();
    const [dataEntries, setDataEntries] = useState<PredictValue[]>([]);
    const [lastPrediction, setLastPrediction] = useState<string | undefined>();

    const { graphNet, edges, nodes } = useGraph((state) => ({
        graphNet: state.graphNet,
        edges: state.edges,
        nodes: state.nodes
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
                    const dataNode = nodes.find(n => dataEdges.find(e => e.source == n.id) != undefined);
                    return {
                        label: e.sourceHandle!.slice(2),
                        nodeType: dataNode!.type!,
                        data: dataNode!.data,
                        value: undefined
                    };
                }));

                // Create the net
                let newNet = new Net();
                newNet.fromJSON(graphNet);
                setNet(newNet);
            }
        }
    }, [graphNet, edges]);

    const setPredictionValue = (value: string | undefined, index: number) => {
        let newEntries = dataEntries;
        newEntries[index].value = value;
        setDataEntries(newEntries);
    }

    const onPredict = () => {
        const data = dataEntries.map(e => parseFloat(e.value ?? ""));
        const x = new Vol(1, 1, data.length);
        data.forEach((d, i) => x.w[i] = d);

        const scores = net.forward(x)
        setLastPrediction(scores.w[0]);
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
                                    </FormControl>
                                </DarkMode>
                            ))}
                            <Button colorScheme="green" width="full" onClick={onPredict}>Predict</Button>

                            {lastPrediction &&
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