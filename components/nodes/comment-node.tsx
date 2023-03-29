import { Textarea } from "@chakra-ui/react"
import { Node } from "reactflow"
import { useState } from 'react';
import useGraph from "../store";
import DefaultNode, { NodeData } from "./base-node"

export type CommentNodeData = {
    text?: string;
}

export const CommentNode = (node: Node) => {
    const [text, setText] = useState(node.data.text);
    const setNodeData = useGraph((state) => state.setNodeData);

    const onTextChanged = (evt: any) => {
        setText(evt.target.value);
        setNodeData(node.id, { text: evt.target.value });
    }

    return (
        <DefaultNode node={node} data={node.data} title="Comment" titleColor="blue.500">
            <Textarea value={text} onChange={onTextChanged} placeholder='Write Your Comment Here' backgroundColor="gray.800" color="white" width={300} />
        </DefaultNode>
    )
}