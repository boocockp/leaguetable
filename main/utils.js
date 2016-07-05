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

const PropertyCacheController = {
    version: 0
};

function memoizeProps(clazz) {
    function propDesc(propName) { return Object.getOwnPropertyDescriptor(clazz.prototype, propName) }

    function memoizedGetter (propName) {
        const getFn = propDesc(propName).get;
        const memoGetter = function () {
            if (!this.propertyCache.has(propName)) {
                this.propertyCache.set(propName, getFn.apply(this));
            }

            return this.propertyCache.get(propName);
        } ;

        // Object.defineProperty(memoGetter, 'name', {value: `${propName}_memoized`});   //TODO make this work

        return memoGetter;
    }

    const calculatedPropNames = Object.getOwnPropertyNames(clazz.prototype)
        .filter( n => propDesc(n).get && !propDesc(n).set);
    console.log( clazz.name, 'calculatedProps', calculatedPropNames);
    calculatedPropNames.forEach( name => {
        Object.defineProperty(clazz.prototype, name, {get: memoizedGetter(name) });
    });

    Object.defineProperty(clazz.prototype, 'propertyCache', {
        get: function () {
            this._propertyCache || (this._propertyCache = new Map());
            if (this._cacheVersion != PropertyCacheController.version) {
                this._propertyCache.clear();
                this._cacheVersion = PropertyCacheController.version
            }

            return this._propertyCache
        }
    });

    return clazz;
}

