Lightweight System Development
==============================

Main points
-----------

- User pairing - quick enough to develop in front of users
- The user manual with examples is the spec 
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
- Tests also bankexample as specs and live help guides
- Tests are functional level, because no low-level components
- Apps with built-in tests
- Run tests on copy of production data to ensure a new version works with existing data
- No separate CI - just deploy and run built-in tests - record results in app?
- No builds
- Deploy = copy files if poss
- Serverless deployment
- App sets up AWS/other services 
- Backup/restore = copy files
- Login with Google

- All data in memory
- Offline first
- Use latest browser features - maybe with polyfills - inc ES6 - look forward, not back
- Consider Chrome-only
- V rapid progress in JS implementations in last few months

Options
-------
- All things are "as far as possible"
- Better if do more, but can just do some
- Eg database out if poss


Other points
------------

- Cached sequences
- Permissions for input types and properties within them
- Permissions for reading events and properties within them
- Database as cache
- Page wiring
- Browser is a good dev and debug environment
- Offline data = fast tests
- Simplicity from components not knowing about their collaborators - just taking in and emitting data "signals"
- Interfaces are irrelevant - each component does not know what it is connected to or what it can "do" to it
  - is this another major change of viewpoint from traditional software?
- Debugging is like checking for presence of signal in circuits
- CloudFormation slow and overkill - easy to write helper methods
- If work app, just target Chrome

Unique bits
-----------

- Function over all inputs, rather than applying changes to objects

Advantages
----------

- Offline almost built in
- Audit trail built in
- Make page available offline with its data eg staff directory
- "Rainbow deployment"

Rationale
---------
- Developers have built up an armoury of tools and practices to solve specific problems, and rarely review which ones are still needed as technology changes
- Back to basics
- Decluttering
- Many parts of current approaches are there to cope with limited storage
- Persistent memory
- Maintaining cache of results is interwoven with the business logic
- Even agile techniques based on old views of what is expensive to do
- If 80% of benefit for 20% of effort, do it the simple way
- Time saved by less fuss is greater than time lost by less thorough techniques
- Rather than struggle to make servers more efficient, get the client to do it
- Server memory and CPU expensive and limited, client memory and CPU cheap and plentiful

Lifetime
--------
- These guidelines would have been ridiculous 10 years ago, and may be again in 10 years
- If it is a little difficult to understand at first, but then clicks, it will give people satisfaction with a new concept
