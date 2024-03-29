import * as React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, chakra, HStack, Box, Button, Text } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    ColumnDef,
    SortingState,
    getSortedRowModel,
    getPaginationRowModel
} from "@tanstack/react-table";

export type DataTableProps<Data extends object> = {
    data: Data[];
    columns: ColumnDef<Data, any>[];
};

export function DataTable<Data extends object>({
    data,
    columns
}: DataTableProps<Data>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting
        }
    });

    return (
        <div>
            <Box overflowX="scroll" backgroundColor="gray.800" rounded="lg">
                <Table>
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            cursor="pointer"
                                        >
                                            <HStack>
                                            <Text>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                                )}
                                            </Text>

                                            <chakra.span pl="2">
                                                {header.column.getIsSorted() ? (
                                                    header.column.getIsSorted() === "desc" ? (
                                                        <TriangleDownIcon aria-label="sorted descending" />
                                                        ) : (
                                                            <TriangleUpIcon aria-label="sorted ascending" />
                                                            )
                                                            ) : null}
                                            </chakra.span>
                                            </HStack>
                                        </Th>
                                    );
                                })}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                                    const meta: any = cell.column.columnDef.meta;
                                    return (
                                        <Td key={cell.id} isNumeric={meta?.isNumeric}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <HStack mt={8} justify="end">
                <HStack pr={4}>
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </HStack>
                <Button
                    onClick={() => table.setPageIndex(0)}
                    isDisabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </Button>
                <Button
                    onClick={() => table.previousPage()}
                    isDisabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </Button>
                <Button
                    onClick={() => table.nextPage()}
                    isDisabled={!table.getCanNextPage()}
                >
                    {'>'}
                </Button>
                <Button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    isDisabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </Button>
            </HStack>
        </div>
    );
}