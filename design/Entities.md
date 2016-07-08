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
- !!All entities must have only read-only properties so can be passed around without buggy components trying to update them
- Property values changed by update operations


Top-level app
-------------
- Seems useful to have top-level app that all entities can use - alternative is to inject everywhere
- Singleton instance that can be reset for testing
- Source of inputs linked to top-level app

Observing changes
-----------------
- See also file Cached Sequence.md
- If observing an entity value, will only change if the actual entity object on that property changes
- Changes to entity properties are observed by observers on those specific properties
- Need a way to get observers anywhere in the code without having to pass app instance around
