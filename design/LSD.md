Lightweight System Development
==============================

Main points
-----------

- User pairing - quick enough to develop in front of users
- Daily iterations
- Event sourcing
- Functional modelling
- Models and views are all just functions
- Functions are live
- Reactive web components
- Data flows
- Wiring components like circuits

- Client side processing from raw events
- Simple storage
- Tests run in browser
- Tests use model where possible
- Tests also act as specs and help guides
- Tests are functional level, because no low-level components
- No builds
- Deploy = copy files
- Backup/restore = copy files

- Serverless deployment
- All data in memory
- Offline first
- No CI - just deploy to environment and run built-in tests
- Use latest browser features - maybe with polyfills - inc ES6


Other points
------------

- Cached sequences
- Permissions for input types and properties within them
- Permissions for reading events and properties within them
- Database as cache
- Page wiring
- Browser is a good dev and debug environment

Unique bits
-----------

- Function over all inputs, rather than applying changes to objects

Advantages
----------

- Offline almost built in
- Audit trail built in
- Make page available offline with its data eg staff directory

Rationale
---------
- Developers have built up an armoury of tools and practices to solve specific problems, and rarely review which ones are still needed as technology changes
- Back to basics
- Many parts of current approaches are there to cope with limited storage
- Maintaining cache of results is interwoven with the business logic
- Even agile techniques based on old views of what is expensive to do

Lifetime
--------
- These guidelines would have been ridiculous 10 years ago, and may be again in 10 years