import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, DarkMode, Flex, LightMode, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Text, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import useGraph from "../store";
import { Trainer } from "convnetjs";

const clamp = (val: number, min: number, max: number) => val < min ? min : (val > max ? max : val);

const TrainingTab: FC<{}> = () => {
    const { errors, createMLGraph } = useGraph((state) => ({
        errors: state.errors,
        createMLGraph: state.createMLGraph
    }));

    const [method, setMethod] = useState("adadelta");
    const [learningRate, setLearningRate] = useState(0.01);
    const [decay, setDecay] = useState(0.001);
    const [batchSize, setBatchSize] = useState(32);
    const [epochs, setEpochs] = useState(10);
    const [trainingSplit, setTrainingSplit] = useState(75);

    const hasErrors = errors.find(e => e.type == "error") != undefined;

    const methodChanged = (evt: any) => setMethod(evt.target.value);

    const startTraining = () => {
        let net = createMLGraph();
        console.log("Network", net);

        // shouldn't be possible but just in case
        if (net == undefined)
            return;

        const trainerConfig = {
            method, 
            learning_rate: method == "sgd" ? learningRate : undefined,
            l2_decay: decay, 
            momentum: method == "sgd" ? 0.9 : undefined, 
            batch_size: batchSize,
        };

        console.log("Trainer", trainerConfig);

        let trainer = new Trainer(net, trainerConfig);
    }

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }

    return (
        <LightMode>
            <VStack h="full" w="400px" backgroundColor="gray.800" p={8} spacing={12} dropShadow="lg" alignItems="start">
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

                    <Flex alignItems="center" justifyContent="space-between" width="full" pt={8}>
                        <Text color="white" flex={1}>Training Split:</Text>
                        <DarkMode>
                            <Box pt={6} pb={2} flex={2}>
                                <Slider aria-label='training-split' value={trainingSplit} onChange={(val) => setTrainingSplit(clamp(val, 10, 90))}>
                                    <SliderMark value={0} style={labelStyles} color="white" width="full">
                                        Training
                                    </SliderMark>
                                    <SliderMark value={70} style={labelStyles} color="white">
                                        Validation
                                    </SliderMark>
                                    <SliderMark
                                        value={trainingSplit}
                                        textAlign='center'
                                        bg='gray.900'
                                        rounded="sm"
                                        color='white'
                                        mt='-10'
                                        ml='-5'
                                        w='12'
                                    >
                                        {trainingSplit}%
                                    </SliderMark>
                                    <SliderTrack backgroundColor="orange.500">
                                        <SliderFilledTrack backgroundColor="green.500" />
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>
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
                    <Button colorScheme="green" width="full" isDisabled={hasErrors} onClick={startTraining}>Start Training</Button>
                </VStack>
            </VStack>
        </LightMode>
    )
}

export default TrainingTab;