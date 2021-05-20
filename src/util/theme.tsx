import React, { PropsWithChildren } from 'react';
import { StylesProvider, ThemeOptions, ThemeProvider, createMuiTheme, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const themeOptions: ThemeOptions = {};

export const theme = createMuiTheme(themeOptions);

export function SiteThemeProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
    return (
        <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StylesProvider>
    );
}
