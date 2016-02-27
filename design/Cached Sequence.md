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

Performance
-----------

- Using Immutable.js List doubled time to process 100k results - profile showed much internal housekeeping
- Having a count aggregator with a condition could save storing elements
- Filter by property function - put all values in map of CachedSequences on first call, use from there, update each new one to correct array

Functional model construction
-----------------------------
- Constructing network and keeping it intact and reusing the functions is key to performance
- Maybe a CachedSequence is primarily a function, with a value property to actually calculate

To Do
-----
- Memoize functions and return same instance if source has not changed
