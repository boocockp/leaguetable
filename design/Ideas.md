Ideas
=====

- Some outputs are also just sequences of values, even if recalculated each time
- Actions can attach to outputs and do something with each new one - how tell which are new?
- Subscribe to outputs
- Time is a sequence of inputs
- A timed output can be just a function that ranges over a time sequence input
- Testing easy if time is just another input
- If inputs are given to the functional model one at a time, it knows when they arrive and can decide how to cache them (or not)

Concepts
--------
- This is different to Redux - you don't specify how to mutate state, you specify how to calculate the outputs if you had all the inputs at once
- It is not a function from an input and a state to a new state, it is a function from all the inputs so far to all the outputs
- The aim is to write the program without worrying about timing or caching the model
- There are no actions - just inputs of various types to various input points

Useful tools
------------

- Immutable.js


Implementation
--------------

- Define functions like unique and groupBy so they return same object if a new value doesn't change them, so don't need to recalculate downstream if memoized
- When an input arrives, defer recalculation so if many sent at once, deal with them all in one go

Questions
---------
- Should functional model objects own their input sequences, or just be given refs to them? 
  - Prob just a ref, as may have different impls and may want diff models against same inputs