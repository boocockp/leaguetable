'use strict';

Function.prototype.memoize = function(resolverFn) {
    return _.memoize(this, resolverFn);
};

Function.prototype.time = function(name) {
    let fn = this;
    return function() {
        let startTime = Date.now();
        let result = fn.apply(this, arguments);
        let endTime = Date.now();
        console.log(name, (endTime - startTime) + 'ms' );
        return result;
    }
};

