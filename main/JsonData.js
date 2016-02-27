'use strict';

class JsonData {

    constructor(dataReceivedCallback) {
        this.dataReceivedCallback = dataReceivedCallback;
        this._cachedJsonData = {};
    }

    get(url, propertyPath) {
        function getValue(url, callback, errorCallback) {
            $.getJSON(url).done(callback).fail(errorCallback);
        }

        if (this._cachedJsonData[url] === undefined) {
            getValue( url, function(data) {
                this._cachedJsonData[url] = data; this.dataReceivedCallback()
            }.bind(this));
            this._cachedJsonData[url] = {};
        }

        let self = this;
        return {
            get value() {
                return _.get(self._cachedJsonData[url], propertyPath) || "";
            }
        };

    }
}