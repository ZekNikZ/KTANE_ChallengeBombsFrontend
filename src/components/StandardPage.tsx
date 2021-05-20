import React, { PropsWithChildren } from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '20px',
        [theme.breakpoints.up('md')]: {
            paddingRight: theme.spacing(10),
            paddingLeft: theme.spacing(10),
        },
        [theme.breakpoints.up('lg')]: {
            paddingRight: theme.spacing(20),
            paddingLeft: theme.spacing(20),
        },
    },
}));

interface PageProps {
    title: string;
}

type Props = PropsWithChildren<PageProps>;

export default function StandardPage(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h3">{props.title}</Typography>
            {props.children}
        </div>
    );
}
