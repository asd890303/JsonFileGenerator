import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider, inject, observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';

import Home from "./home";
import HomeState from "../states/home.state";

const homeState = new HomeState();
const stores = {
    homeState
}

ReactDOM.render(
    <Provider store={homeState}>
        <React.Fragment>
            {/* {Route} */}
            <Home />
        </React.Fragment>
    </Provider>,
    document.getElementById('root') as HTMLElement
)