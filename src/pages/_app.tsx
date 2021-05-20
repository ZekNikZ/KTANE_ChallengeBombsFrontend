import { AppProps } from 'next/dist/next-server/lib/router/router';
import React from 'react';

import { CssBaseline } from '@material-ui/core';
import Head from 'next/head';
import { SiteThemeProvider } from '../util/theme';

import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <base />
                <title>Challenge Bomb Database</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </Head>

            <SiteThemeProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />

                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SiteThemeProvider>
        </>
    );
}
