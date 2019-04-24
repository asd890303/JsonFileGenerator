import { action, computed, observable, toJS } from 'mobx';

import BaseState from './base.state';
import axios from 'axios';
export default class HomeState extends BaseState {

    @observable isLoading: boolean = true;

    @observable pageSize: number = 3;
    @observable pageIndex: number = 0;

    constructor() {
        super();
    }

    private getJsonFile = () => {

    }


    @action.bound
    handleClick() {
        this.isLoading = true;
        this.pageIndex += 1;
    }

    @action.bound
    initHomePage = () => {

    }
}