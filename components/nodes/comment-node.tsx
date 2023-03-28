import { Textarea } from "@chakra-ui/react"
import { Node } from "reactflow"
import DefaultNode, { NodeData } from "./base-node"

export const CommentNode = (node: Node, data: NodeData) => {
    return (
        <DefaultNode node={node} data={data} title="Comment" titleColor="blue.500">
            <Textarea placeholder='Write Your Comment Here' backgroundColor="gray.800" color="white" width={300} />
        </DefaultNode>
    )
}