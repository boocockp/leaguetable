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

    get length() { return this._updatedElements.length }

    filter(cond) {
        return new FilterCachedSequence(this, cond);
    }

    map(expr) {
        return new MapCachedSequence(this, expr);
    }

    distinct() {
        return new DistinctCachedSequence(this);
    }

    sort(expr) {
        return new SortCachedSequence(this, expr);
    }

    sum() {
        this._sumAggregator = this._sumAggregator || new SumAggregator(this);
        return this._sumAggregator.value;
    }

    sumFn() {
        this._sumAggregator = this._sumAggregator || new SumAggregator(this);
        return this._sumAggregator;
    }

    countFn() {
        this._countAggregator = this._countAggregator || new CountAggregator(this);
        return this._countAggregator;
    }

    join(sep) {
        return this._updatedElements.join(sep);
    }

    merge(otherSeq) {
        return new MergeCachedSequence(this, otherSeq);
    }

    get _updatedElements() {
        this._ensureUpToDate();
        return this._elements;
    }

    _ensureUpToDate() {}
}


class FunctionalCachedSequence extends CachedSequence {

    constructor(sources, processElementsFn) {
        super([]);

        this._sources = sources;
        this._processElementsFn = processElementsFn;
        this._sourceIndexes = sources.map( () => 0 );
    }

    _ensureUpToDate() {
        this._sources.forEach( (source, i) => {
            let sourceElements = source._updatedElements;
            let unprocessedSourceElements = sourceElements.slice(this._sourceIndexes[i]);
            if (unprocessedSourceElements.length) {
                var elementsPlusNew = this._elements.concat(this._processNewElements(unprocessedSourceElements));
                this._elements = this._processAllElements(elementsPlusNew);
                this._sourceIndexes[i] = sourceElements.length;
            }
        });
    }

    _processNewElements(elements) {
        return this._processElementsFn(elements);
    }

    _processAllElements(elements) {
        return elements;
    }

}

class FilterCachedSequence extends FunctionalCachedSequence {

    constructor(source, condition) {
        super([source], (els) => els.filter(condition));
    }
}

class SortCachedSequence extends FunctionalCachedSequence {

    constructor(source, expr) {
        super([source], els => els);
        this._expr = expr;
    }

    _processAllElements(elements) {
        return _.sortBy(elements, this._expr);
    }
}

class DistinctCachedSequence extends FunctionalCachedSequence {

    constructor(source) {
        let values = new Set();
        let isNew = (v) => {
            if (values.has(v)) {
                return false;
            } else {
                values.add(v);
                return true;
            }
        };
        super([source], (els) => els.filter(isNew));
    }
}

class MapCachedSequence extends FunctionalCachedSequence {

    constructor(source, expr) {
        super([source], (els) => els.map(expr));
    }
}

class MergeCachedSequence extends FunctionalCachedSequence {

    constructor(...sources) {
        super(sources, (els) => els );
    }
}

class SumAggregator {

    constructor(source) {
        this._source = source;
        this._sourceIndex = 0;
        this._value = 0;
    }

    get value() {
        this._ensureUpToDate();
        return this._value;
    }

    _ensureUpToDate() {
        let sourceElements = this._source._updatedElements;
        let unprocessedSourceElements = sourceElements.slice(this._sourceIndex);
        this._value = this._processElements(this._value, unprocessedSourceElements);
        this._sourceIndex = sourceElements.length;
    }

    _processElements(oldValue, elements) {
        return oldValue + (_.sum(elements) || 0);
    }

}

class CountAggregator {

    constructor(source) {
        this._source = source;
        this._sourceIndex = 0;
        this._value = 0;
    }

    get value() {
        this._ensureUpToDate();
        return this._value;
    }

    _ensureUpToDate() {
        let sourceElements = this._source._updatedElements;
        let unprocessedSourceElements = sourceElements.slice(this._sourceIndex);
        this._value = this._processElements(this._value, unprocessedSourceElements);
        this._sourceIndex = sourceElements.length;
    }

    _processElements(oldValue, elements) {
        return oldValue + elements.length;
    }

}

