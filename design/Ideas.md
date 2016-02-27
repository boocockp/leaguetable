Ideas
=====

- Some outputs are also just sequences of values, even if recalculated each time
- Actions can attach to outputs and do something with each new one - how tell which are new?
- Subscribe to outputs
- Time is a sequence of inputs
- A timed output can be just a function that ranges over a time sequence input
- Testing easy if time is just another input
- If inputs are given to the functional model one at a time, it knows when they arrive and can decide how to cache them (or not)
- Inputs can be given one at a time or as a list - xxxInput() takes either
- More control over deglitching if in control of triggering updates after inputs arrive

Concepts
--------
- This is different to Redux - you don't specify how to mutate state, you specify how to calculate the outputs if you had all the inputs at once
- It is not a function from an input and a state to a new state, it is a function from all the inputs so far to all the outputs
- Updating the outputs when the inputs change is hidden from the programmer
- The aim is to write the program without worrying about timing or caching the model
- There are no actions - just inputs of various types to various input points
- The client does all the work, the server just stores data
- Client sends inputs to server to append to input stream
- Clients are more powerful than servers - memory and spare CPU - but still worth optimising
- If decide to do on server - will all run there on node anyway

Environmental Factors
---------------------

- Server CPU vs Client
- Server memory vs Client
- Bandwidth
- Zipping performance
- JavaScript performance

Input Sources
------------

- Should be separate objects as will take many forms - need a common subscribe mechanism
- Each output/property of a functional model is an input source for another model
- Need a single sequence of inputs per model
- Persist only validated inputs

Useful tools
------------

- Immutable.js


Implementation
--------------

- There are two ways of doing this: push new values down, or pull from bottom, cache and invalidate
- Define functions like unique and groupBy so they return same object if a new value doesn't change them, so don't need to recalculate downstream if memoized
- If use immutable collections, easy to memoize as just need to know whether same instance or not
- When an input arrives, defer recalculation so if many sent at once, deal with them all in one go
- If a filter knew an incoming array could only have things added to the end, would just need to check those - and inputs are like that
- Even with cached sequences, still need to memoize to store one for each argument eg by teamName
- With async results and versioning may do recalculation of everything after each aync result received
- Updates to functions: just replace whole model and replay the results
- Build a model as a network of cached sequences in a single function, expose some or all properties for value and notifications

Asynchronous functions
----------------------
- Need care on when to trigger inputReceived, as if do it directly in callback can cause a loop
- Need to know the call is in progress so don't do it again

Questions
---------
- Should functional model objects own their input sequences, or just be given refs to them? 
  - Prob just a ref, as may have different impls and may want diff models against same inputs
  
  