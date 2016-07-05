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

Cached vs non-cached
--------------------
- Is there a clash?
- What meaning do add, value, transform and aggregation operations have?
- Dual purpose sequences possible

Other types of Cached sequence
------------------------------
- As well as array cache, could have:
  - map of id to separate array sequences
  - map of id to separate reduced data sequences

Other implementations
---------------------
- Transforms are implemented to produce a database query that gives you the desired result
- Client may turn chain of sequence transforms into a spec that is sent to server and creates websocket stream

Observers
---------
- Use state before and after an input
- Observer can track back up to input CS and observe it's before/after signals
- May be multiple inputs
- Has to act like replay subject - cold observable, remembers everything
- *and* has to return current value when you subscribe to it
- Having leaf go direct to source for changes avoids glitches
- With filter and many observers, could optimise by only calling those observers that need to know - maybe filter terminates the observe chain

Events
------
- Need to take account of distinct events - if more values in output list, there are more events
- May need to highlight what has changed, down to cell level, after an input

Aggregators
-----------

- NOT cached sequences - only have a series of simple values
- Can be combined with each other, not with sequences
- One type of aggregator is latest - so can combine two CachedSequence.latest values, but not the whole sequence

Getting updates for one item in a collection
--------------------------------------------
- Need to pick one entity from a collection by id and get a DataSequence of changes to that entity

Fine grained updates
--------------------
- Really depends on what want to do with it, so maybe need to depend on every stream you take, not just outer structure stream eg each account balance, not just list
- Maybe anywhere you take a value, you need to observe changes
- *So* maybe you never take a value except in an onChange handler
- For a table, could either
  - add every value to a list to be listened for, then regenerate all HTML if need to
  - have data display custom components that are attached to a data sequence

Optimisation
------------
- Streams with selection smarts eg index on an id
- Sequences that look at find query functions and index themselves automatically on the results of that function
- Streams based on db tables
- Caches of entity SOOs
- Timestamp of cache, timestamp of events, so know which ones to apply
- Still need plain maps as well as SOOs
- Two sorts of system: big hierarchical database objects, web page with interacting components and known named singletons



Why not Rx
----------
- Simpler
- Have value without subscribing
- Can load many values in one go - important for startup with initial data
- Glitch-free
- Want the whole input list in one go, then updates
- Need to be able to insert elements before end of cached sequences and then recalculate to allow for merged updates
- *Could* see it as a stream of input lists, rather than a stream of individual items
- Aggregates are updated as you go, not just at the end

Why not Lazy.js
---------------

- Doesn't seem to be able to add to sequence after created
- No caching to avoid repeated traversals

To Do
-----


Thoughts
--------
- Property change - send old and new to use in accumulator streams
- Hierarchical state is just the output of many functions
- Async is built in
- Customer.orders = orders where custId == this.id; just like a query
- Lazy built in
- All SOOs self contained - have to feed streams into them
- Issue: how to make remote views of server objects behave like live SOOs, efficiently
- Input objects - must be plain objects
- Objects with stream members vs objects with value members
- Auto wrap objects when need to use them
- Bridge between conventional objects that notify property changes, and SOOs
- If have stream, use it, else wrap in stream when needed