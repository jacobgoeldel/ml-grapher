import { Handle, Node, Position } from 'reactflow';
import { FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from '@chakra-ui/react';
import DefaultNode from './base-node';
import Papa from "papaparse";

const handleStyle = { width: 12, height: 12, top: "47%" };

type TextProp = {
  text: string;
};

const DataNode = (node: Node, data: TextProp) => {
  return (
    <DefaultNode node={node} data={data} title="Data Upload" titleColor="green.500">
      <Handle type="source" position={Position.Right} style={handleStyle} />

      <FormControl>
        <FormLabel color="white">File</FormLabel>
        <Input 
        style={{ paddingLeft: 0}}
        border={0}
        color="white"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const files = e.target.files;
          console.log(files);
          if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
              complete: function(results: any) {
                console.log("Finished:", results.data);
              }}
              )
            }
          }}
        />
      </FormControl>
    </DefaultNode>
  );
}

export default DataNode;