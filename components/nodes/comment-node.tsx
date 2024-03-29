import { Textarea } from "@chakra-ui/react"
import { Node } from "reactflow"
import { useState } from 'react';
import useGraph from "../store";
import DefaultNode, { NodeData } from "./base-node"
import ResizeTextarea from "react-textarea-autosize";
import { forwardRef } from "react";

interface AutoResizeProps { 
  value: string, 
  onChange: (evt: any) => void, 
  placeholder: string 
}

const AutoResizeTextarea = forwardRef<HTMLDivElement, AutoResizeProps>((props, ref) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      minRows={1}
      as={ResizeTextarea as any}
      backgroundColor="gray.800" 
      color="white" 
      width={300}
      {...props}
    />
  );
});
AutoResizeTextarea.displayName = "TextAreaAutoSizing";


export const CommentNode = (node: Node) => {
    const [text, setText] = useState(node.data.text || "");
    const setNodeData = useGraph((state) => state.setNodeData);

    const onTextChanged = (evt: any) => {
        setText(evt.target.value);
        setNodeData(node.id, { text: evt.target.value });
    }

    return (
        <DefaultNode node={node} data={node.data} title="Comment" titleColor="blue.500">
            <AutoResizeTextarea value={text} onChange={onTextChanged} placeholder='Write Your Comment Here' />
        </DefaultNode>
    )
}