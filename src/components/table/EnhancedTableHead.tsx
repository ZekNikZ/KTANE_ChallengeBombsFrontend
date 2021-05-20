import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import { Column, RowAction, TableStyles } from './EnhancedTable';
import React from 'react';

interface Props<T extends { id: I }, I extends string | number> extends TableStyles {
    disableSelection?: boolean;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, property: keyof T) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: 'asc' | 'desc';
    orderBy: keyof T;
    rowCount: number;
    columns: Column<T>[];
    rowActions?: RowAction<T>[];
}

export default function EnhancedTableHead<T extends { id: I }, I extends string | number>(
    props: Props<T, I>
): JSX.Element {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof T) => (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {!props.disableSelection && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    </TableCell>
                )}
                {props.columns.map((headCell) => (
                    <TableCell
                        key={headCell.id as React.Key}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {props.rowActions && <TableCell>Actions</TableCell>}
            </TableRow>
        </TableHead>
    );
}
