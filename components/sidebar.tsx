import { TbAlignBoxBottomLeft, TbChartLine, TbFileDescription, TbStack2 } from 'react-icons/tb'
import { HStack, IconButton, Icon, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import AddTab from "./tabs/AddTab";
import TrainingTab from './tabs/TrainingTab';
import FileTab from './tabs/FileTab';
import PredictTab from './tabs/PredictTab';

const SideBar: FC<{}> = () => {
    const [selectedId, setSelectedId] = useState(-1);

    const tabClicked = (id: number) => setSelectedId(id == selectedId ? -1 : id);

    return (
        <HStack h="full" spacing={0}>
            <VStack p={4} spacing={8} h="full" backgroundColor="gray.700" dropShadow="lg">
                <IconButton
                        aria-label='Files'
                        variant="unstyled"
                        icon={<Icon as={TbFileDescription} w={12} h={12} />}
                        onClick={() => tabClicked(0)}
                        color={selectedId == 0 ? "white" : "gray.900"}
                        _hover={{ color: selectedId == 0 ? "white" : "gray.300" }}
                    />
                <IconButton
                    aria-label='Add Nodes'
                    variant="unstyled"
                    icon={<Icon as={TbStack2} w={12} h={12} />}
                    onClick={() => tabClicked(1)}
                    color={selectedId == 1 ? "white" : "gray.900"}
                    _hover={{ color: selectedId == 1 ? "white" : "gray.300" }}
                />
                <IconButton
                    aria-label='Training'
                    variant="unstyled"
                    icon={<Icon as={TbChartLine} w={12} h={12} />}
                    onClick={() => tabClicked(2)}
                    color={selectedId == 2 ? "white" : "gray.900"}
                    _hover={{ color: selectedId == 2 ? "white" : "gray.300" }}
                />
                <IconButton
                    aria-label='Predict'
                    variant="unstyled"
                    icon={<Icon as={TbAlignBoxBottomLeft} w={12} h={12} />}
                    onClick={() => tabClicked(3)}
                    color={selectedId == 3 ? "white" : "gray.900"}
                    _hover={{ color: selectedId == 3 ? "white" : "gray.300" }}
                />
            </VStack>

            <FileTab visible={selectedId == 0} />
            <AddTab visible={selectedId == 1} />
            <TrainingTab visible={selectedId == 2} />
            <PredictTab visible={selectedId == 3} />
        </HStack>
    )
}

export default SideBar;