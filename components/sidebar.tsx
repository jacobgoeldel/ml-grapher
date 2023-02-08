import { BiAddToQueue } from 'react-icons/bi'
import { HStack, IconButton, Icon, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import AddTab from "./tabs/AddTab";

const SideBar: FC<{}> = () => {
    const [selectedId, setSelectedId] = useState(-1);

    const tabClicked = (id: number) => setSelectedId(id == selectedId ? -1 : id);

    return (
        <HStack h="full" spacing={0}>
            <VStack p={4} h="full" backgroundColor="gray.700" dropShadow="lg">
                <IconButton
                    aria-label='Add Nodes'
                    variant="unstyled"
                    icon={<Icon as={BiAddToQueue} w={12} h={12} />}
                    onClick={() => tabClicked(0)}
                    color={selectedId == 0 ? "white" : "gray.900"}
                    _hover={{ color: selectedId == 0 ? "white" : "gray.300" }}
                />
            </VStack>
            {selectedId == 0 && <AddTab />}
        </HStack>
    )
}

export default SideBar;