import { WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, HStack, IconButton, LightMode, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import useGraph from "./store";

const ErrorList = () => {
    const errors = useGraph((state) => state.errors);
    const { isOpen, onToggle } = useDisclosure();

    const hasErrors = errors.find(e => e.type == "error") != undefined;

    return (
        <LightMode>
            {errors.length > 0 &&
                <VStack position="absolute" bottom={6} right={6} align="end">
                    {isOpen && errors.map(e => (
                        <Alert status={e.type == "error" ? "error" : "warning"} rounded="md">
                            <AlertIcon />
                            <AlertTitle>{e.type == "error" ? "Error" : "Warning"}</AlertTitle>
                            <AlertDescription>{e.msg}</AlertDescription>
                        </Alert>
                    ))}
                    <Button leftIcon={hasErrors ? <WarningIcon /> : <WarningTwoIcon />} colorScheme={hasErrors ? 'red' : "orange" } onClick={onToggle}>
                        {errors.length}
                    </Button>
                </VStack>
            }
        </LightMode>
    )
}

export default ErrorList;