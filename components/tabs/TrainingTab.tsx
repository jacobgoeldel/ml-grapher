import {
    Alert, AlertIcon, AlertTitle, Box, Button, DarkMode, Flex, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
    NumberInputStepper, Select, Text, VStack, useDisclosure
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import useGraph from "../store";
import { Trainer, Vol, Net } from "convnetjs";
import { LineChart, CartesianGrid, XAxis, Legend, Line, Tooltip as GraphTooltip } from "recharts";

const clamp = (val: number, min: number, max: number) => val < min ? min : (val > max ? max : val);

const setIntervalX = (callback: () => void, delay: number, repetitions: number, done: () => void) => {
    var x = 0;
    var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
            window.clearInterval(intervalID);
            done();
        }
    }, delay);

    return intervalID;
}

const TrainingTab: FC<{ visible: boolean }> = ({ visible }) => {
    const { errors, createMLGraph, edges, setGraphNet } = useGraph((state) => ({
        errors: state.errors,
        createMLGraph: state.createMLGraph,
        edges: state.edges,
        setGraphNet: state.setGraphNet
    }));

    const [method, setMethod] = useState("adadelta");
    const [learningRate, setLearningRate] = useState(0.01);
    const [decay, setDecay] = useState(0.001);
    const [batchSize, setBatchSize] = useState(32);
    const [epochs, setEpochs] = useState(10);

    const [trainer, setTrainer] = useState<any | undefined>();
    const [data, setData] = useState<any | undefined>();
    const [labels, setLabels] = useState<any | undefined>();
    const [trainerInterv, setTrainerInterv] = useState<any | undefined>();
    const [training, setTraining] = useState(false);
    const [loss, setLoss] = useState<number | undefined>();
    const [lossGraph, setLossGraph] = useState<any[]>([]);

    const { isOpen: isClearModalOpen, onOpen: onClearModalOpen, onClose: onClearModalClose } = useDisclosure();

    const hasErrors = errors.find(e => e.type == "error") != undefined;

    const methodChanged = (evt: any) => setMethod(evt.target.value);

    const trainingStep = (data: any, labels: any, trainer: any) => {

        if (data == undefined || labels == undefined || trainer == undefined)
            return;

        // loop through data epochs
        let totalLoss = 0;

        // loop through dataset
        for (var i = 0; i < data[0].length; i++) {
            var x = new Vol(1, 1, data.length, 0.0); // a 1x1xn volume initialized to 0's.

            // map each columns data into the volume
            for (var j = 0; j < data.length; j++) {
                x.w[j] = data[j][i];
            }

            const stats = trainer.train(x, labels[i]);
            totalLoss += isNaN(stats.cost_loss) ? 0 : stats.cost_loss;
        }

        const avgloss = totalLoss / data[0].length;

        if (avgloss != Infinity) {
            setLoss(prevLoss => avgloss);
            setLossGraph(prev => [...prev, { epoch: prev.length + 1, loss: avgloss }])
        }

        setTrainer((val: any) => trainer);
    }

    const startTraining = () => {
        let { graph, data, labels } = createMLGraph()!;

        // shouldn't be possible but just in case
        if (graph == undefined)
            return;

        const trainerConfig = {
            method,
            learning_rate: method == "sgd" ? learningRate : undefined,
            l2_decay: decay,
            momentum: method == "sgd" ? 0.9 : undefined,
            batch_size: batchSize,
        };

        console.log("Training Setup", { "Graph": graph, "Data": data, "Labels": labels, "Trainer Config": trainerConfig });

        // create a net
        let net = new Net();
        net.makeLayers(graph);

        let trainer = new Trainer(net, trainerConfig);

        setTrainerInterv(setIntervalX(
            () => trainingStep(data, labels, trainer),
            0,
            epochs,
            () => {
                setTrainerInterv(false);
                setTraining(false);
                setGraphNet(trainer.net.toJSON());
            }));

        setData(data);
        setLabels(labels);
        setTraining(true);
        setLossGraph([]);
        setLoss(undefined);
        setTrainer(undefined);
        setGraphNet(undefined);
    }

    const resumeTraining = () => {
        setTrainerInterv(setIntervalX(
            () => trainingStep(data, labels, trainer),
            0,
            epochs,
            () => {
                setTrainerInterv(false);
                setTraining(false);
            }));

        setTraining(true);
    }

    const clearTraining = () => {
        setData(undefined);
        setLabels(undefined);
        setTraining(false);
        setLossGraph([]);
        setLoss(undefined);
        setTrainer(undefined);
        setGraphNet(undefined);
        onClearModalClose();
    }

    const stopTraining = () => {
        clearInterval(trainerInterv);
        setTrainerInterv(undefined);
        setTraining(false);
    }


    // if the structure of the graph changes, stop training and invalidate any previous training
    useEffect(() => {
        stopTraining();
        clearTraining();
    }, [edges]);

    // clean up and stop training if we switch tabs
    useEffect(() => {
        if (!visible && training) {
            stopTraining();
        }
    }, [visible]);

    return (
        <Box hidden={!visible} h="full">
            <LightMode>
                <VStack h="full" w="500px" backgroundColor="gray.800" p={8} spacing={12} dropShadow="lg" alignItems="start">
                    <Text fontSize='4xl' color="white" h="min">Training</Text>

                    <VStack w="full" spacing={4} alignItems="start">
                        <Text fontSize='xl' color="white" h="min">Hyper Parameters</Text>

                        <Flex alignItems="center" justifyContent="space-between" width="full">
                            <Text color="white" flex={1}>Method:</Text>
                            <DarkMode>
                                <Select color="white" backgroundColor="gray.900" flex={1} value={method} onChange={methodChanged}>
                                    <option value="sgd">SGD</option>
                                    <option value="adadelta">Adadelta</option>
                                    <option value="adagrad">Adagrad</option>
                                </Select>
                            </DarkMode>
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between" width="full">
                            <Text color="white" flex={1}>Learning Rate:</Text>
                            <DarkMode>
                                <NumberInput max={1} min={0.000001} precision={4} step={0.001} value={learningRate} onChange={(text, val) => setLearningRate(val)} color="white" flex={1} isDisabled={method != "sgd"}>
                                    <NumberInputField backgroundColor="gray.900" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </DarkMode>
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between" width="full">
                            <Text color="white" flex={1}>Decay:</Text>
                            <DarkMode>
                                <NumberInput max={0.9} min={0} precision={4} step={0.001} value={decay} onChange={(text, val) => setDecay(val)} color="white" flex={1}>
                                    <NumberInputField backgroundColor="gray.900" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </DarkMode>
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between" width="full">
                            <Text color="white" flex={1}>Epochs:</Text>
                            <DarkMode>
                                <NumberInput max={1000} min={1} value={epochs} onChange={(text, val) => setEpochs(val)} color="white" flex={1}>
                                    <NumberInputField backgroundColor="gray.900" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </DarkMode>
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between" width="full">
                            <Text color="white" flex={1}>Batch Size:</Text>
                            <DarkMode>
                                <NumberInput max={1024} min={1} value={batchSize} onChange={(text, val) => setBatchSize(val)} color="white" flex={1}>
                                    <NumberInputField backgroundColor="gray.900" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </DarkMode>
                        </Flex>
                    </VStack>

                    <VStack w="full" spacing={4} alignItems="start">
                        <Text fontSize='xl' color="white" h="min">Training</Text>
                        {hasErrors &&
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                <AlertTitle>Fix Errors Before Training</AlertTitle>
                            </Alert>
                        }

                        {lossGraph.length > 0 &&
                            <Box backgroundColor="gray.900" padding={8} pl={6} rounded="md">
                                <LineChart
                                    width={400}
                                    height={200}
                                    data={lossGraph}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-gray-700)" />
                                    <XAxis dataKey="epoch" />
                                    <Legend />
                                    <GraphTooltip labelFormatter={(label) => `Epoch ${label}`} />
                                    <Line type="monotone" dataKey="loss" stroke="#8884d8" strokeWidth={2} dot={false} animateNewValues={false} isAnimationActive={false} />
                                </LineChart>
                            </Box>
                        }
                        {loss != undefined && <Text fontSize='xl' color="white">Loss: {loss?.toLocaleString(undefined, { maximumFractionDigits: 4 })}</Text>}

                        {training ?
                            <Button colorScheme="red" width="full" isDisabled={hasErrors} onClick={stopTraining}>Stop Training</Button> :
                            (trainer == undefined ?
                                <Button colorScheme="green" width="full" isDisabled={hasErrors} onClick={startTraining}>Start Training</Button> :
                                <>
                                    <Button colorScheme="green" width="full" isDisabled={hasErrors} onClick={resumeTraining}>Resume Training</Button>
                                    <Button colorScheme="red" width="full" isDisabled={hasErrors} onClick={onClearModalOpen}>Clear Training</Button>
                                </>
                            )}
                    </VStack>
                </VStack>

                <DarkMode>
                    <Modal isOpen={isClearModalOpen} onClose={onClearModalClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader color="white">Confirm</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody color="white">
                                Are you sure you want to clear all previous training?
                            </ModalBody>

                            <ModalFooter>
                                <LightMode>
                                    <Button colorScheme="red" mr={2} onClick={clearTraining}>Ok</Button>
                                    <Button colorScheme='blue' mr={3} onClick={onClearModalClose}>
                                        Cancel
                                    </Button>
                                </LightMode>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </DarkMode>
            </LightMode>
        </Box>
    )
}

export default TrainingTab;