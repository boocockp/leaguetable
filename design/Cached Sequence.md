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