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
        return new MapCachedSequence(this, expr);
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

    merge(otherSeq) {
        return new MergeCachedSequence(this, otherSeq);
    }

    get _updatedElements() {
        return this._elements;
    }
}


class FilterCachedSequence extends CachedSequence {

    constructor(source, condition) {
        super([]);

        this._source = source;
        this._expr = condition;
        this._sourceIndex = 0;
    }

    get _updatedElements() {
        this._ensureUpToDate();
        return this._elements;
    }

    _ensureUpToDate() {
        let sourceElements = this._source._updatedElements;
        let unprocessedSourceElements = sourceElements.slice(this._sourceIndex);
        this._elements = this._elements.concat(unprocessedSourceElements.filter(this._expr));
        this._sourceIndex = sourceElements.length
    }

}

class MapCachedSequence extends CachedSequence {

    constructor(source, expr) {
        super([]);

        this._source = source;
        this._expr = expr;
        this._sourceIndex = 0;
    }

    get _updatedElements() {
        this._ensureUpToDate();
        return this._elements;
    }

    _ensureUpToDate() {
        let sourceElements = this._source._updatedElements;
        let unprocessedSourceElements = sourceElements.slice(this._sourceIndex);
        this._elements = this._elements.concat(unprocessedSourceElements.map(this._expr));
        this._sourceIndex = sourceElements.length
    }
}

class MergeCachedSequence extends CachedSequence {

    constructor(source1, source2) {
        super([]);

        this._source1 = source1;
        this._source2 = source2;
        this._source1Index = 0;
        this._source2Index = 0;
    }

    get _updatedElements() {
        this._ensureUpToDate();
        return this._elements;
    }

    _ensureUpToDate() {
        let source1Elements = this._source1._updatedElements;
        let unprocessedSource1Elements = source1Elements.slice(this._source1Index);
        this._elements = this._elements.concat(unprocessedSource1Elements);
        this._source1Index = source1Elements.length;

        let source2Elements = this._source2._updatedElements;
        let unprocessedSource2Elements = source2Elements.slice(this._source2Index);
        this._elements = this._elements.concat(unprocessedSource2Elements);
        this._source2Index = source2Elements.length
    }
}

