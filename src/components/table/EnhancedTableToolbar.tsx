import React from 'react';
import clsx from 'clsx';

import { IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Fragment } from 'react';
import { TableAction } from './EnhancedTable';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

interface Props {
    numSelected: number;
    title?: string;
    selectedActions?: TableAction[];
    unselectedActions?: TableAction[];
}

export default function EnhancedTableToolbar(props: Props): JSX.Element {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                    {props.title || ''}
                </Typography>
            )}

            {numSelected > 0 ? (
                <Fragment>
                    {props.selectedActions &&
                        props.selectedActions.map((action, i) => (
                            <Tooltip key={i} title={action.title}>
                                <IconButton aria-label={action.title} onClick={action.action}>
                                    {action.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                </Fragment>
            ) : (
                <Fragment>
                    {props.unselectedActions &&
                        props.unselectedActions.map((action, i) => (
                            <Tooltip key={i} title={action.title}>
                                <IconButton aria-label={action.title} onClick={action.action}>
                                    {action.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                </Fragment>
            )}
        </Toolbar>
    );
}
