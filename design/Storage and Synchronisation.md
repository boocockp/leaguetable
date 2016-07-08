Storage and synchronisation
===========================

JSON storage and info
---------------------
- Need to store types to recreate class
- Restore into correct class
- Some types like enums may store only the name and type
- Date strings need to be restored as dates
- Enums need to be restored to the instances, not one like it
- For info may send different data eg just name for enums

Persistence
-----------
- Offline first - if can save to and update from a remote store that is a bonus
- Simple - single user - assume always online - just update when start and save after every change
- Unlike local storage, data requested from remote store will not be available synchronously - will arrive later
- An input store is just a Cached Sequence, and may have data added to it at any point

Updates and tracking
--------------------
- Instead of single source of inputs, could have normal methods that generate instructions for updates
- Instructions for updates can be applied to other apps to sync them
- This is a separate concern to functional modelling
- Instruction for update could be just method name + data if each method takes just one arg

Syncing app instances
---------------------
- 1:1 correspondence between single-arg function calls and update objects
- Can call app method and save an update, or replay an update into the app
- Normal state is a JSON snapshot plus a list of updates
- Updates are ordered by local or server timestamp on a "best efforts" basis
- Collisions handled by bumping up millisecond
- Write each update as a separate S3 object
- Periodically roll up older updates into new snapshot and record timestamp of latest with it
- If Lambda, could use period less than time functions kept alive to avoid rebuilding model each time - can schedule down to 1 minute
- Clients (including lambda) read latest snapshot and all updates, and apply ones after the snapshot timestamp
- Snapshots never change, can be cached forever
- Clients poll for new updates with filter for greater than latest timestamp they have
- Clients store updates locally and send them to server as soon as they can

Consistency
-----------
- *Cannot* have updates that depend on a previous state value
- Must tolerate updates ending up in a different order than on original client
- *So* this technique depends on functional modelling
- A bit like Prevayler and LMAX, but they use transactions, and rely on one central server
- Also a bit like Git - store all data and sync with others when possible
- Transactions neither possible nor necessary with this distributed approach
- Updates should be minimal necessary, not whole object overwrites, to minimise lost updates
- Could end up breaking validation rules - need to deal with this, probably by indicating problem and having manual sort-out - like Git merge
