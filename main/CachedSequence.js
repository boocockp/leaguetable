'use strict';

class CachedSequence {

    constructor(elements) {
        this._elements = (elements || []).slice()
    }

    add(entries) {
        if (entries instanceof CachedSequence) {
            this._elements = this._elements.concat(entries._elements)
        } else if (_.isArray(entries)) {
            this._elements = this._elements.concat(entries)
        } else {
            this._elements = this._elements.concat([entries])
        }
    }

    withAdded(entries) {
        if (entries instanceof CachedSequence) {
            return new CachedSequence(this._elements.concat(entries._elements))
        } else if (_.isArray(entries)) {
            return new CachedSequence(this._elements.concat(entries))
        } else {
            return new CachedSequence(this._elements.concat([entries]))
        }
    }

    get length() { return this._updatedElements.length }

    filter(cond) {
        return new FilterCachedSequence(this, cond);

    }

    map(expr) {
        return new CachedSequence(this._updatedElements.map(expr));
    }

    distinct() {
        return new CachedSequence(_.uniq(this._updatedElements));
    }

    sort(expr) {
        return new CachedSequence(_.sortBy(this._updatedElements, expr));
    }

    sum() {
        return _.sum(this._updatedElements);
    }

    join(sep) {
        return this._updatedElements.join(sep);
    }

    get _updatedElements() {
        return this._elements;
    }
}


class FilterCachedSequence extends CachedSequence {

    constructor(source, condition) {
        super([]);

        this._source = source;
        this._condition = condition;
        this._sourceIndex = 0;
    }

    get _updatedElements() {
        this._ensureUpToDate();
        return this._elements;
    }

    _ensureUpToDate() {
        let unprocessedSourceElements = this._source._elements.slice(this._sourceIndex);
        this._elements = this._elements.concat(unprocessedSourceElements.filter(this._condition));
        this._sourceIndex = this._source._elements.length
    }


}