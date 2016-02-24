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
            this._elements = this._elements.concat(this._processElements(unprocessedSourceElements));
            this._sourceIndexes[i] = sourceElements.length;
        });
    }

    _processElements(elements) {
        return this._processElementsFn(elements);
    }

}

class FilterCachedSequence extends FunctionalCachedSequence {

    constructor(source, condition) {
        super([source], (els) => els.filter(this._expr));
        this._expr = condition;
    }
}

class MapCachedSequence extends FunctionalCachedSequence {

    constructor(source, expr) {
        super([source], (els) => els.map(this._expr));
        this._expr = expr;
    }
}

class MergeCachedSequence extends FunctionalCachedSequence {

    constructor(...sources) {
        super(sources, (els) => els );
    }
}

