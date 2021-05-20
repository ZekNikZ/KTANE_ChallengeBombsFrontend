import React from 'react';
import clsx from 'clsx';
import { splitArrayOnNull } from '../util/arrays';

import { AccountTree, Folder, Info, LibraryAdd, Publish, SvgIconComponent } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

const links: ({ title: string; icon: SvgIconComponent } | null)[] = [
    { title: 'Packs', icon: AccountTree },
    { title: 'Missions', icon: Folder },
    null,
    { title: 'Create Pack', icon: LibraryAdd },
    { title: 'Submit Run', icon: Publish },
    null,
    { title: 'Contact Us', icon: Info },
];

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface Props {
    anchor: Anchor;
    onClose?: () => void;
}

export default function NavigationDrawer(props: Props): JSX.Element {
    const classes = useStyles();
    return (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: props.anchor === 'top' || props.anchor === 'bottom',
            })}
            role="presentation"
            onClick={() => props.onClose && props.onClose()}
            onKeyDown={() => props.onClose && props.onClose()}
        >
            {splitArrayOnNull(links).map((group, i) => (
                <>
                    {i > 0 && <Divider />}
                    <List key={i}>
                        {group.map(({ title, icon: Icon }) => (
                            <ListItem button key={title}>
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={title}></ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </>
            ))}
        </div>
    );
}
