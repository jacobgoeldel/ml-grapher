import { FC } from 'react';
import { Node } from 'reactflow';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import useGraph from '../store';

type TextProp = {
    text: string;
};

const DefaultNode: FC<{ node: Node, data: TextProp, title: string, titleColor: string, children: JSX.Element | JSX.Element[] }> = ({ node, title, titleColor, data, children }) => {
    const deleteNode = useGraph((state) => state.deleteNode);
    const onDeleteIcon = () => deleteNode(node.id);

    return (
        <Box borderRadius='sm' bg='#25293b' borderWidth={1} borderColor='gray.900' shadow='md' overflow='hidden' cursor="default">
            <HStack
                align="center"
                justify="space-between"
                p='1'
                pl='2'
                pr='2'
                bg={titleColor}
                color='gray.50'
                lineHeight='tight'
                className="custom-drag-handle"
                cursor="move"
            >
                <Text fontWeight="semibold">{title}</Text>
                <IconButton
                    variant="unstyled"
                    aria-label='delete node'
                    onClick={onDeleteIcon}
                    icon={<CloseIcon />}
                    color="gray.200"
                    _hover={{ color: "white" }} />
            </HStack>

            <Box p={2}>
                {children}
            </Box>

        </Box>
    );
}

export default DefaultNode;