Cached Sequences
================

- General idea: because can only append elements and cannot change existing elements, can optimise many operations
- Need some form of caching
- Need operations like filter and map that only look at differences
- Need to know what previous call to a function with same arguments returned and/or use a special subclass to implement ops
- Need unique, or set
- Effectively, each op needs to be a subclass, like Rx, but simpler because don't need the notification
- Leaving the CachedSequence world with toArray is like subscribe in Rx
- Can these be integrated with Immutable.js?
- Are these monads?
- Has anyone done this already? eg lazy libraries?

Important
---------
- When is a (functional) cached sequence still valid - do you need a version?  
- What about sorting results. for example, when size deson't change


Functional subclasses
=====================

- These would be functions, not immutable objects
- As their inputs changed, so would their outputs

Simple expressions
------------------
- To do simple expressions based on one or more functions, would need to use map (for one) or combine (for multiple) with a function
- Easier to use if could just have a simple expression, especially in a worksheet

Performance
-----------

- Using Immutable.js List doubled time to process 100k results - profile showed much internal housekeeping
- Having a count aggregator with a condition could save storing elements
- Filter by property function - put all values in map of CachedSequences on first call, use from there, update each new one to correct array

Functional model construction
-----------------------------
- Constructing network and keeping it intact and reusing the functions is key to performance
- Maybe a CachedSequence is primarily a function, with a value property to actually calculate

NON-cached sequences
--------------------

- If you know you don't care about old values, you could not cache them, and just have an index of where you are
- Or you could discard them and only recreate from original if needed
- Or could just have merged operations through the iterators
- Trade-off memory with speed - repeated traversals of underlying source
- Maybe smart caching - thresholds for saving

Observers
---------
- Use state before and after an input
- Observer can track back up to input CS and observe it's before/after signals
- May be multiple inputs
- Has to act like replay subject - cold observable, remembers everything
- *and* has to return current value when you subscribe to it
- Having leaf go direct to source for changes avoids glitches

Aggregators
-----------

- NOT cached sequences - only have a series of simple values
- Can be combined with each other, not with sequences
- One type of aggregator is latest - so can combine two CachedSequence.latest values, but not the whole sequence

Why not Rx
----------
- Simpler
- Have value without subscribing
- Can load many values in one go - important for startup with initial data
- Glitch-free
- Want the whole input list in one go, then updates
- *Could* see it as a stream of input lists, rather than a stream of individual items

Why not Lazy.js
---------------

- Doesn't seem to be able to add to sequence after created
- No caching to avoid repeated traversals

To Do
-----
