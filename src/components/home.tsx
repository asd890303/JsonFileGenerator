import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider, inject, observer } from 'mobx-react';

import HomeState from "../states/home.state";

interface HomeProps {
    props: HomeState;
}

@inject("store")
@observer
export default class Home extends React.Component<any, any> {
    constructor(props: HomeProps) {
        super(props);
    }

    handleClick = () => {
        this.props.store.handleClick();
    }

    componentDidMount = () => {
        this.props.store.initHomePage();
    }

    public render() {

        return (
            <React.Fragment>
                {/* TODO */}
            </React.Fragment>
        );
    }
}
