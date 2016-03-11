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
- Are cached sequences all data sequences, but some give you all the items and some just give you the latest
- Can always get the latest from an 'all'
- Could convert a single into an 'all' by passing it through a converter
- Don't forget bulk inputs at startup

Aggregators
-----------

- NOT cached sequences - only have a series of simple values
- Can be combined with each other, not with sequences
- One type of aggregator is latest - so can combine two CachedSequence.latest values, but not the whole sequence

Unified view
------------
- Data Sequences are streams of single values, maybe with an initial value
- Accumulated (cached) sequences take a single value stream and  transform it into a sequence of lists of all the values so far - initial value empty list
- Data Sequences can still take bulk inputs of many values, but they don't save them
- Need to build in the storage and replay mechanism to accumulated sequences
- Can still have the observe at source mechanism with either type of stream
- *So* aggregators and cached sequences do have some things in common
- How treat list ops like map, filter, sort between Data Sequences and Cached Sequences?
- Does a Cached Sequence have an underlying Data Sequence, or act like one?

Another view
------------
- Everything is a Data Sequence, but some Data Sequences have Cached Sequences as their items
- Map, filter, etc should apply to Data Sequence as a whole
- The operations on Cached Sequences are applied to the items (lists), not the sequences
- How do you make these kind of operations intuitive?

Yet another view
----------------
- Data Sequences have no memory - each item is separate, only get new items if subscribe/operate on it
- Cached Sequences remember everything, so if subscribe/operate on it, you get all items so far
- Then map, filter mean the same thing
- May be some special ops on Cached Sequences that don't make sense on plain Data Sequences - like sort
- Possible dual view: 
    - a Cached Sequence is a Data Sequence of individual items that remembers everything
    - a Cached Sequence is a Data Sequence of lists that grow after each input
- Maybe the meaning of current value shows the difference - single item for Data Sequence, list for Cached Sequence    

Observers
---------
- Use state before and after an input
- Observer can track back up to input CS and observe it's before/after signals
- May be multiple inputs
- Has to act like replay subject - cold observable, remembers everything
- *and* has to return current value when you subscribe to it
- Having leaf go direct to source for changes avoids glitches


Multiple inputs into one output
-------------------------------
- Like account summaries
- This is really a case of an outer structure depending on one input, and contained sequences depending on another
- Don't need to actually combine the inputs explicitly as have a helper function outside the definition
- Maybe better to explicitly combine, then both inputs will update the output

Combining Sequences
-------------------
- Apply a function that takes the latest values of all the sources and produces a combined result - default is a list
- Only one source can update at a time, and when it does need to get the up to date values of all the others when processing
- *And* need to process updates to all the sources in order
- *So* maybe it can't be lazy, or you can't reproduce the correct combinations
- If subscribe to updates for each source, can keep up to date
- BUT if all you want is to update downstream when either source changes, may be another way

Why not Rx
----------
- Simpler
- Have value without subscribing
- Publish by default
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
