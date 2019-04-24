import { action, computed, observable } from 'mobx';

export default class BaseState {
    @observable timeState: string;

    constructor() {
        this.timeState = new Date().toLocaleString();
    }

    private refreshTimeState() {
        this.timeState = new Date().toLocaleString();
        console.log(this.timeState);
    }
}