Entities
========

Entity modelling
----------------
- Entity class that represents one instance
- Entity manager class that creates the instances from inputs
- Entity instance objects can contain functions representing whatever, and they can use entity collections
- Create, update and delete are standard input types
- May want a data class for each entity that contains the fixed data

Defining the model
------------------
- Programmer wants to define the structure of the *output* of the functions that create a model from the inputs, and the functions are automatic on CUD inputs
- Events: the CUD operations are too low-level - it's the business-level events, like Transaction, that matter
= Updates ≠ inputs ≠ events

Validation
----------
- Entity able to validate itself?  May need to be able to temporarily apply input to use the validation
- Self-describing - class contains metadata to allow generation of UI
- Good if metadata can describe validation rules too
- Other entity instances may have their validation rules broken by a change in one eg account balance when a transaction added

Functional OO
-------------
- Have all classes you would normally expect to find
- Only updates allowed are CUD ops
- Entities may contain collections of others OR may have derived collections
- They have properties defined by functions, whose values may change as data is added elsewhere

Top-level app
-------------
- Seems useful to have top-level app that all entities can use - alternative is to inject everywhere
- Singleton instance that can be reset for testing
- Source of inputs linked to top-level app

Updates and tracking
--------------------
- Instead of single source of inputs, could have normal methods that generate instructions for updates
- Instructions for updates can be applied to other apps to sync them
- This is a separate concern to functional modelling
