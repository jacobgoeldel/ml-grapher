import { TbAlignBoxBottomLeft, TbChartLine, TbFileDescription, TbStack2 } from 'react-icons/tb'
import { HStack, IconButton, Icon, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import AddTab from "./tabs/AddTab";
import TrainingTab from './tabs/TrainingTab';
import FileTab from './tabs/FileTab';
import PredictTab from './tabs/PredictTab';
import { IconType } from 'react-icons/lib';

const SideBar: FC<{}> = () => {
    const [selectedId, setSelectedId] = useState(-1);

    const tabClicked = (id: number) => setSelectedId(id == selectedId ? -1 : id);

    const TabIcon: FC<{id: number, aria: string, icon: IconType}> = ({ id, aria, icon }) => (
        <IconButton
            aria-label={aria}
            variant="unstyled"
            icon={<Icon as={icon} w={12} h={12} />}
            onClick={() => tabClicked(id)}
            color={selectedId == id ? "white" : "gray.900"}
            _hover={{ color: selectedId == id ? "white" : "gray.300" }}
        />
    )

    return (
        <HStack h="full" spacing={0}>
            <VStack p={4} spacing={8} h="full" backgroundColor="gray.700" dropShadow="lg">
                <TabIcon id={0} icon={TbFileDescription} aria="Files Tab" />
                <TabIcon id={1} icon={TbStack2} aria="Add Nodes Tab" />
                <TabIcon id={2} icon={TbChartLine} aria="Training Tab" />
                <TabIcon id={3} icon={TbAlignBoxBottomLeft} aria="Predict Tab" />
            </VStack>

            <FileTab visible={selectedId == 0} />
            <AddTab visible={selectedId == 1} />
            <TrainingTab visible={selectedId == 2} />
            <PredictTab visible={selectedId == 3} />
        </HStack>
    )
}

export default SideBar;