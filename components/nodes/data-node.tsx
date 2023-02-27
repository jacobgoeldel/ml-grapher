import { Handle, Node, Position, useUpdateNodeInternals } from 'reactflow';
import { Button, FormControl, FormLabel, Input, LightMode, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from '@chakra-ui/react';
import DefaultNode from './base-node';
import Papa from "papaparse";
import { useState } from 'react';

const handleStyle = { width: 12, height: 12 };

type TextProp = {
  text: string;
};

const DataNode = (node: Node, data: TextProp) => {
  const [dataSet, setDataSet] = useState<any | undefined>();
  const updateNodeInternals = useUpdateNodeInternals();

  const loadData = (e: any) => {
    const files = e.target.files;
    if (files) {
      Papa.parse(files[0], {
        complete: function (results: any) {
          setDataSet(results.data);
          updateNodeInternals(node.id);
        }
      });
    }
  }

  const onViewData = () => {

  }

  return (
    <DefaultNode node={node} data={data} title="Data Upload" titleColor="green.500">

      {dataSet && dataSet[0].map((c: string, i: number) => (
        <Handle type="source" position={Position.Right} style={{ ...handleStyle, top: 198 + i * 40 }} key={i} id={`target-handle-${i + 1}`} />
      ))
      }

      <FormControl>
        <FormLabel color="white">File</FormLabel>
        <Input
          style={{ paddingLeft: 0 }}
          border={0}
          color="white"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={loadData}
        />
      </FormControl>

      <LightMode>
        <Button width="full" colorScheme="green" onClick={onViewData}>View Data</Button>
      </LightMode>

      <>
        {dataSet && dataSet[0].map((c: string) => (
          <Text color="white" mt={4} mr={2} textAlign="right">"{c}"</Text>
        ))}
      </>
    </DefaultNode>
  );
}

export default DataNode;