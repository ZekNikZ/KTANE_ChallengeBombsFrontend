import React, { Component } from 'react';
import { getComparator, stableSort } from '../../util/tables';

import {
    Button,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';

import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { SvgIconComponent } from '@material-ui/icons';

const styles = ({ spacing }: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: '20px',
        },
        paper: {
            width: '100%',
            marginBottom: spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    });

export type TableStyles = WithStyles<typeof styles>;

export interface TableAction {
    title: string;
    icon: SvgIconComponent;
    action?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface RowAction<T> {
    references: keyof T;
    color: 'primary' | 'secondary';
    label: string;
    action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, val: T[keyof T]) => void;
}

export interface Column<T> {
    id: keyof T;
    align: 'left' | 'right';
    width: string | number;
    disablePadding?: boolean;
    label: string;
    renderer?: (val: T[keyof T], row: T) => JSX.Element | string;
}

interface Props<T extends { id: I }, I extends string | number = T['id']> {
    disableSelection?: boolean;
    order: 'asc' | 'desc';
    orderBy: keyof T;
    rows: T[];
    columns: Column<T>[];
    title?: string;
    selectedActions?: TableAction[];
    unselectedActions?: TableAction[];
    rowActions?: RowAction<T>[];
    onSelectionChange?: (newSelected: I[]) => void;
    handleRowClick?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: I) => void;
}

interface State<T extends { id: I }, I extends string | number> {
    selected: I[];
    order: 'asc' | 'desc';
    orderBy: keyof T;
    page: number;
    dense: boolean;
    rowsPerPage: number;
}

class EnhancedTable<T extends { id: I }, I extends string | number = T['id']> extends Component<
    Props<T, I> & TableStyles,
    State<T, I>
> {
    constructor(props: Props<T, I> & TableStyles) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'id',
            selected: [],
            page: -0,
            dense: true,
            rowsPerPage: 10,
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.handleRequestSort = this.handleRequestSort.bind(this);
    }

    componentDidMount() {
        this.setInitialSort();
    }

    componentDidUpdate(prevProps: Props<T, I> & TableStyles) {
        if (prevProps.order !== this.props.order || prevProps.orderBy !== this.props.orderBy) {
            this.setInitialSort();
        }

        if (prevProps.rows.length > this.props.rows.length) {
            this.setState({
                selected: [],
            });
        }
    }

    setInitialSort() {
        this.setState({
            order: this.props.order,
            orderBy: this.props.orderBy,
        });
    }

    handleRequestSort(_event: React.MouseEvent<HTMLSpanElement, MouseEvent>, property: keyof T) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property,
        });
    }

    handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            const newSelecteds = this.props.rows.map((n) => n.id);
            this.setState({
                selected: newSelecteds,
            });

            if (this.props.onSelectionChange) {
                this.props.onSelectionChange(newSelecteds);
            }
        } else {
            this.setState({
                selected: [],
            });

            if (this.props.onSelectionChange) {
                this.props.onSelectionChange([]);
            }
        }
    }

    handleClick(event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: I) {
        this.props.handleRowClick && this.props.handleRowClick(event, id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSelectClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: I) {
        event.stopPropagation();
    }

    handleSelectionChange(_event: React.ChangeEvent<HTMLInputElement>, id: I) {
        const selectedIndex = this.state.selected.indexOf(id);
        let newSelected: I[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.selected.slice(1));
        } else if (selectedIndex === this.state.selected.length - 1) {
            newSelected = newSelected.concat(this.state.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.selected.slice(0, selectedIndex),
                this.state.selected.slice(selectedIndex + 1)
            );
        }

        this.setState({
            selected: newSelected,
        });

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelected);
        }
    }

    handleChangePage(_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) {
        this.setState({ page });
    }

    handleChangeRowsPerPage(event: { target: { value: string } }) {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
        });
    }

    handleChangeDense(event: { target: { checked: boolean } }) {
        this.setState({
            dense: event.target.checked,
        });
    }

    isSelected(id: I) {
        return this.state.selected.indexOf(id) !== -1;
    }

    render() {
        const emptyRows =
            this.state.rowsPerPage -
            Math.min(this.state.rowsPerPage, this.props.rows.length - this.state.page * this.state.rowsPerPage);
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    {((this.props.selectedActions && this.props.selectedActions.length > 0) ||
                        (this.props.unselectedActions && this.props.unselectedActions.length > 0)) && (
                        <EnhancedTableToolbar
                            numSelected={this.state.selected.length}
                            title={this.props.title}
                            selectedActions={this.props.selectedActions}
                            unselectedActions={this.props.unselectedActions}
                        />
                    )}
                    <TableContainer>
                        <Table className={classes.table} size={this.state.dense ? 'small' : 'medium'} stickyHeader>
                            <colgroup>
                                {!this.props.disableSelection && <col style={{ width: '50px' }} />}
                                {this.props.columns.map((column, i) => (
                                    <col key={i} style={{ width: column.width }} />
                                ))}
                            </colgroup>
                            <EnhancedTableHead
                                disableSelection={this.props.disableSelection}
                                classes={classes}
                                numSelected={this.state.selected.length}
                                order={this.state.order}
                                orderBy={this.state.orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={this.props.rows.length}
                                columns={this.props.columns}
                                rowActions={this.props.rowActions}
                            />
                            <TableBody>
                                {stableSort(this.props.rows, getComparator(this.state.order, this.state.orderBy))
                                    .slice(
                                        this.state.page * this.state.rowsPerPage,
                                        this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
                                    )
                                    .map((row, index) => {
                                        const isItemSelected = this.isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => this.handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                {!this.props.disableSelection && (
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onChange={(event) =>
                                                                this.handleSelectionChange(event, row.id)
                                                            }
                                                            onClick={(event) => this.handleSelectClick(event, row.id)}
                                                        />
                                                    </TableCell>
                                                )}
                                                {this.props.columns.map((column, i) => (
                                                    <TableCell key={i} align={column.align}>
                                                        {column.renderer
                                                            ? column.renderer(row[column.id], row)
                                                            : row[column.id]}
                                                    </TableCell>
                                                ))}
                                                {this.props.rowActions && (
                                                    <TableCell>
                                                        <div style={{ display: 'flex' }}>
                                                            {this.props.rowActions.map((action, i) => (
                                                                <Button
                                                                    key={i}
                                                                    variant="contained"
                                                                    size="small"
                                                                    color={action.color}
                                                                    style={{
                                                                        width: 'auto',
                                                                        height: 'auto',
                                                                        margin: '0px',
                                                                        marginRight: '5px',
                                                                    }}
                                                                    onClick={(e) =>
                                                                        action.action &&
                                                                        action.action(e, row[action.references])
                                                                    }
                                                                >
                                                                    {action.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (this.state.dense ? 43 : 63) * emptyRows }}>
                                        <TableCell colSpan={this.props.columns.length + 2} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100, 250]}
                        component="div"
                        count={this.props.rows.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        );
    }
}

export default class WrapperHOC<T extends { id: string | number }> extends React.PureComponent<Props<T>> {
    private readonly C = this.wrapperFunc();

    render(): JSX.Element {
        return <this.C {...this.props} />;
    }

    private wrapperFunc() {
        type t = new () => EnhancedTable<T>;
        return withStyles(styles, { withTheme: true })(EnhancedTable as t);
    }
}
