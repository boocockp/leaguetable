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
- Additions and deletions must be idempotent - check ids before adding
- *So* this technique depends on functional modelling
- A bit like Prevayler and LMAX, but they use transactions, and rely on one central server
- Also a bit like Git - store all data and sync with others when possible
- Transactions neither possible nor necessary with this distributed approach
- Updates should be minimal necessary, not whole object overwrites, to minimise lost updates

Validation
----------
- Could end up breaking validation rules - need to deal with this, probably by indicating problem and having manual sort-out - like Git merge
- Situation would occur in any app where separate offline updates are merged
- Approach is to accept occasional conflicting updates that cause an invalid situation and have a way of dealing with them
- Maybe: only push updates when valid, get remote updates first, show errors after sync
- Picture changes if all going through a central server anyway

Timing
------
- What should timestamp on an update be - time done on client, or time sent to server?
- Use a current time service and adjust client clock 



Persistence principles
----------------------
- Each action has a unique id from when it is created on the local app instance
- Each action has a timestamp from when it is created on the local app instance
- Actions are immutable
- Actions may be grouped into updates
- Clients shold minimise the number of updates they create
- An update has a timestamp to identify it and an number of actions
  - Most original updates will have one action, but they may be grouped for efficiency
- Updates are immutable
- A copy of the same action may occur in more than one update
- Each update has a unique id from when it is created on the local app instance
- Updates must have a timestamp close (~5secs) to the time they are stored on the central store, *not* when created on client
- Updates must be stored so that the timestamps are in the order they were created on the client
- Updates must be applied in timestamp order
- Updates may be combined and given a timestamp the same as the latest of the original ones
- When updates are combined, they must be kept in timestamp order and the actions must be kept in the order they occurred within the update
- Updates may be removed from the central store so long as their actions are moved to another update or included in a snapshot
- Actions must be applied in the order they occur in the update
- A snapshot holds the effect of applying all actions up to a certain timestamp
- Snapshots are immutable
- A snapshot must include all actions in all updates with timestamps less than or equal to the snapshot timestamp
- No new update can be created with a timestamp less than or equal to an existing snapshot
- A local copy of an update is as good as a remote one, as they are immutable, so use local copies where possible

Persistent redux store - synchronizing on startup
-------------------------------------------------
- On startup, need to load snapshot
- Could also load new snapshot at any time, so need to handle that
- On startup, create redux store and start app straight away - don't wait for snapshot to load
- Load_snapshot action returns new state like other actions, but it is a completely new state from the snapshot
- A findLatestSnapshot function returns a promise, used to dispatch load_snapshot to the redux store
- Store time of latest snapshot loaded into store, clear remote updates applied
- Fetch remote updates, each of which may contain multiple actions
- Find actions after snapshot time AND not already applied, and dispatch to store
- Store ids of update actions applied to store
- If remote store unavailable, load snapshot and updates from local store
- Also load actions from local store not stored in updates yet
- Store snapshot and updates in local store
- Find local updates not already applied, and dispatch to store and store ids

Persistent redux store - synchronizing with updates
---------------------------------------------------
- Repeat above procedure at regular intervals
- Only load snapshots later than one loaded at startup
- Only load updates not already applied
- Remote store should be given ids of updates needed so it doesn't download ones already stored locally
- Remote store should be able to get ids of updates available so old ones stored locally can be removed
- Remote store should return updates requested in time order
- Don't remove old updates until all new ones downloaded, or may be missing data if go offline
- Don't need to load local updates or actions as should already be applied

Persisting local updates
------------------------
- See consistency rules above
- All local actions need to be stored locally when they are applied to the store
- Local actions need to be given an id immediately
- Store local action ids so not re-applied when come through as remote updates
- At intervals, look for local updates and send to remote store
- Don't delete immediately, because if went offline and refreshed at that point, would not see local updates
- Delete local updates when see the ids come back in a remote update
- What if: went offline after sending local updates, didn't come back on until after remote updates folded in to a snapshot?
- Give local updates a timestamp when confirmed received by server
- If get a snapshot later than that time, delete them
- Ok if send same update twice, as would just overwrite the first one - so long as updates are immutable everywhere
- Do not create updates over and over for the same actions
- Once actions stored locally in an update, remove them from actions store
- Need to know when local updates sent to stop sending again BUT need to retry if come on line again - maybe mark update as new, sent or received
- AND the update timestamp needs to be set when stored



Implementing remote store
-------------------------
- Basic: each action or set of actions is stored as a separate update in S3 
- Key ends in app id and timestamp when uploaded
- Store takes current timestamp when uploaded 


