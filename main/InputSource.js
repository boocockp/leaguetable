'use strict';

class InputSource {

    constructor() {
        this._inputs = [];
        this._listeners = [];
    }

    get latest() { return _.last(this._inputs); }

    add(inputs) {
        this._inputs =  this._inputs.concat(inputs);
        this._notifyChange(inputs);
    }

    addListener(listenerFn) {
        this._listeners.push(listenerFn);
    }

    _notifyChange(inputs) {
        this._listeners.forEach( l => l(inputs) );
    }
}