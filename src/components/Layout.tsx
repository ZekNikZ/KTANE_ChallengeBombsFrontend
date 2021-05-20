import React, { Component, PropsWithChildren } from 'react';
import Header from './Header';

export default class Layout extends Component<PropsWithChildren<unknown>> {
    render(): JSX.Element {
        const { children } = this.props;
        return (
            <div className="layout">
                <Header />
                {children}
            </div>
        );
    }
}
