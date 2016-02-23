'use strict';

class CachedSequence {

    constructor(elements) {
        this._elements = elements || []
    }

    add(entries) {
        if (entries instanceof CachedSequence) {
            return new CachedSequence(this._elements.concat(entries._elements))
        } else if (_.isArray(entries)) {
            return new CachedSequence(this._elements.concat(entries))
        } else {
            return new CachedSequence(this._elements.concat([entries]))
        }
    }

    get length() { return this._elements.length }

    filter(cond) {
        return new CachedSequence(this._elements.filter(cond));
    }

    map(expr) {
        return new CachedSequence(this._elements.map(expr));
    }

    distinct() {
        return new CachedSequence(_.uniq(this._elements));
    }

    sort(expr) {
        return new CachedSequence(_.sortBy(this._elements, expr));
    }

    sum() {
        return _.sum(this._elements);
    }

    join(sep) {
        return this._elements.join(sep);
    }
}