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
- Could generate html on server for static site
- Avoid explicit reduce actions

Entities
--------

- You can still have (should have?) domain entities - they are just defined with functions, not mutable fields eg Account
- A domain functional model can contain many instances of lower level functional models eg General Ledger FM with many Account FMs
- No explicit repositories and updates


Use cases
---------

- Not aimed at highest performance
- Aimed at rapid development through bringing implementation closer to mental model

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
- Functional models don't need to receive inputs - they just observe changes in other input sequences

Model Objects
-------------
- Zero or more incoming sequences
- One or more outgoing sequences
- Don't know whether incoming are direct inputs or from other model objects
- Inputs are special objects with outgoing sequences that adapt outside world
- Merging and saving multiple inputs would be responsibility of one object, separate from the model objects
- AND are these the same things as aggregates created within a function?
- AND can you create new instances of defined model objects within a function? SOOP!
- Model objects may create new model objects

Currying
--------
- Good if could have automatic currying with fewer than intended args so could say:
  let hasPostingFor = (accountId, transaction) => _.some(transaction.postings, p => p.accountId == accountId);
  let accountTransactions = transactions.filter( hasPostingFor(accountId));

Functional Model properties
---------------------------
- Want the actual value to use as the property value - what people expect
- Also want the change stream as input to other things  - maybe <prop>Changes naming convention, or changeStream(<name>)

Proxy for sequence
------------------
- Can attach a proxy to a sequence to make it look like a normal object
- Gives out the properties of the latest value in the sequence
- Also has onChange method to observe changes
- Has changes property to get the underlying sequence, maybe to use in more transformations


External actions
----------------

- Observe changes, send and emit ack which is stored persistently
- Function generating actions looks at difference between required and sent
- Required could depend on what already sent to create a series of actions that have to be done in order

Testing
-------

- Many tests direct to central business model
- Record input streams from page elements for recording tests
- Detect output stream changes
- Detect page changes by comparing before and after
- Use for live how to guides as well
- Mark up all elements with the property they represent so page-scraping is automatic
- Any HTML page can have structured data extracted from it without further definition
- Tests need to be sequences of specifiers for inputs and actions and expected outputs, so can be run slowly and described as they go
- If acting in one page and checking effect in another, have both open in side-by-side frames
- Pages inherently testable
- *** Clients should sync data, so if test is another client, just has its own copy and checks that
- Tests run in browser - fast, debugging easy, run in all browsers
- Could use Electron to run tests from command line if needed, but not to drive tests - unnecessary layer
- BUT there are some things you can't do from inside browser, like full screen


Views
-----
- Multiple instances of view - so can have two copies of app view open in one window, and see side by side - esp good for demo
- What is model, what is view - not fixed - you decide
- Controllers: not relevant


Authorisation levels
--------------------
- Different views to each user
- Different data items to each user
- Can you filter at event level, so can still download all data to client and let views happen there?
- May need to adjust views on client so they only include the items available
- Have a definition of what available for each client - use to filter when downloading and also control views
- Aim for being able to have property-level control for each user
- Projections and selections of data for each user
- Include only fields specifically allowed to see
- Web views only show UI control if that item key is in the data
 
Synchronisation
---------------
- Updates to input store may not be at end of sequence, and will require full recalculation
- Need mechanism to force invalidation/recalculation all down the tree
- Would also work for cached sequences where values not always appended eg a sort or filter
- Possible: full recalc flag to be checked alongside version
- May be able to optimize by giving index of first inserted element, so recalc from there?

Client storage
--------------
- May be able to have immutable data files which are made cacheable for ever so they stay in browser cache
- Maybe 1Mb chunks
- Supplement with latest events

APIs
----
- Run core model app on server to give traditional REST API
- Need mapping for rest to app methods/properties
- Accept PUT/POST into input sequence through usual validation for updates

Caching and databases
---------------------
- Could materialise certain views into database records
- See database as just a cache
- Events are still the source of truth
- Database can be reconstructed from events at any time
- Data migration is just a rebuild from scratch with new business logic

Mutable model alternative
-------------------------
- Would be possible to have a higher-performance app where updates modified calculated parts of the model directly eg account balance
- Trade off purity for speed
- Pros and cons?

All data on client
------------------
- Simplest, but not only way
- Virtual sequences that request certain inputs according to a condition when necessary
- Could even just send the condition to the server as JS
- Serialize a whole chain of functional sequences, send to server to reconstruct and execute there
- If server could cache chains or *parts* of chains, even better
- Don't change the definition, just where it is executed

Client app
----------
- Use Electron to have a proper desktop app
- Unlimited data storage 

Validation
----------
- Don't have sync call to know which errors are result of an action
- Can use correlation id to link actions to the errors they produce
- Would also work if validation done remotely
- Include a client id to ensure errors only sent to the right client
- If have entity id, regard as updates, validate only what sent
- If no entity id, all required fields must be present
- Cross-field validation will require input from existing

Server validation
-----------------
- *Must* have some code on server to ensure correct validation of inputs before applied to core set - security and consistency
- Do you persist raw inputs or after validation?
- What happens if change some validation rules so that old inputs are no longer valid or invalid? 

Login and identity
------------------
- Login with Google account to get Cognito identity
- Admin uses server app to generate one-time random phrase or password 
- User sends while logged in along with name and email from Google profile
- If one-time password recognised, associate profile details with Cognito identity and add password to used list

Set up environments in code
---------------------------
- The project code sets up a working app environment, including all cloud services
- Can deploy any number of versions
- Immutable environments
- Can copy production data to any environment - or just test data
- Can have a second copy of prod environment for troubleshooting
- Can run all tests on top of production data
- Can smoke test existing production data on copy
- Can make env live and roll back just by switching DNS
- Need to support local dev with AWS in background
- Store commit and version in config
- Need to rollback with correct script - store it in the deployment?
- Define resource objects as vars, connected to stack
- Need to create, refresh, create with check not there, delete
- Do any of the actions with each resource
- Resources refer to each other just as variables
- Stack has some overall params like app root name? Or just top-level vars
- Useful if could store stack as JSON?   Hard if cross-references - use reference/id replacement


Useful tools
------------

- Immutable.js ?
- Lazy.js ?


Reactive Updates
----------------

- There are two ways of doing this: push new values down, or pull from bottom, cache and invalidate
- Define functions like unique and groupBy so they return same object if a new value doesn't change them, so don't need to recalculate downstream if memoized
- If use immutable collections, easy to memoize as just need to know whether same instance or not
- When an input arrives, defer recalculation so if many sent at once, deal with them all in one go
- If a filter knew an incoming array could only have things added to the end, would just need to check those - and inputs are like that
- Even with cached sequences, still need to memoize to store one for each argument eg by teamName
- With async results and versioning may do recalculation of everything after each aync result received
- Updates to functions: just replace whole model and replay the results
- Build a model as a network of cached sequences in a single function, expose some or all properties for value and notifications
- Avoid updates to views while they are not shown or are collapsed
- Avoid refreshing the whole page



Asynchronous functions
----------------------
- Need care on when to trigger inputReceived, as if do it directly in callback can cause a loop
- Need to know the call is in progress so don't do it again

Concentration of events
-----------------------
- Eg individual form-field entries into submitted input
- Maybe updates to entity into current state
- Have to decide when old events no longer of interest, just keep their final result

Questions
---------
- Should functional model objects own their input sequences, or just be given refs to them? 
  - Prob just a ref, as may have different impls and may want diff models against same inputs
  
Spreading the word
------------------
- A very short Todo MVC might get it noticed (not really MVC, though)
  
  