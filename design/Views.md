Views
=====

- Nice to have a simple function from data to HTML
- Needs to be linked to callback on the data item it depends on
- Good to have dependency as fine-grained as possible - for efficiency and convenience
- Example: update values in a select while in middle of filling in a form without losing values entered in rest of form

- View is always a function
- Q: should function take a data value or a data value producer? Or either, and sort it out?
- If a component is just a function, can pass it to an updater function
- To update an element, execute a function that takes a data source and a html function
  - the function sets up an observer on the data source, marks the element produced and replaces it (outerHtml) by executing the html function
  - then calls the html function first time and returns that into outer part
  - may need some housekeeping if have observers nested - maybe ok if just replace the observer?
- If aggregates had a way to get an observable for any property, would be useful - or just want one for whole thing?
- Sequences need a way to get an observable for whole thing

Updates to view elements
--------------------------

- Need to output a component that can be changed if the thing it observes changes
- Pure views may not be the best way
- Could be done with tricks like tagging an element and finding it to update when oberver gets an update
- Web components look useful here - maybe not polymer
- May need to keep some aspects of elements while replace others eg select value when options updated
- Possible principle: link a data source only to the element/component it affects
- Possible principle: functional models can contain other FMs, so link a component only to the FM, or single value, that affects it
- May be good if can link standard elements too, eg table rows or cells

Components
----------

- Reuse
- Organizing code
- Encapsulation
- App is a big component made of others
- A special input field could be a component
- Could have their own functional models - one or more - 
- Any component will have fixed parts and variable parts
- Shadow dom is optional
- Could use web component api
- Templates could be used, but JS functions more flexible

View component functional model
-------------------------------

- Follow general principle of functional models
- Responsible for producing HTML and/or dom elements
- Attachment to actual page: separate or part of it?
- Input is another functional model - or maybe multiple models
- Is a class, not just a function
- May take inputs from elements it creates
- May ask for current values of elements
- May need any relevant events from elements
- May have its own internal functional models to transform inputs to outputs
- May have outputs other than HTML - inputs for other functional models
- *So* unusual because it has outputs derived from inputs *and* outputs it originates
- May be view FMs with no inputs that just produce a one-off fixed element model
- Possible mechanism: outputs HTML and events required to host, host renders and sends back events to an input
- Renderer is responsible for getting output elements of view in HTML or other form and putting them on the page in a given place
- How does nesting work: eg table component with a List of accounts as its input, and row components each with one account as input
- Container views produce HTML with placeholders for lower level views, either containers themselves or leaf elements
- Renderer observes the properties of a container to put their HTML into the container's element template
- Renderer takes property updates and replaces those elements in the container template
- May need to replace either all the contents of a container or one element among siblings - user inner or outer HTML
- Container can update all of itself if it wants to
- Renderer may need to give elements its own ids so it can keep track and access them efficiently
- Has html or htmlTemplate methods which are a sequence of html templates
- If htmlTemplate, has properties corresponding to names on the placeholders in the htmlTemplate
- The properties deliver more view components with html or htmlTemplate methods
- The way the view component is specified is a different concern to the way it is delivered to the renderer - but may be similar

Getting values and handling events
----------------------------------
- A view component could have an eventsRequired property and a method to call with events
- Or a function to get a sequence of events or value changes from elements
- Could have a sequence that started with current value of an input and then produced each change

Input views
-----------
- For inputs, a view functional model can bring together many input gesture streams to one stream of changes eg a form input component  -> saved data
- The main functional model can take this consolidated stream and persist it - don't need to record every input gesture
- In the view FM, may need mappings and expressions to translate UI gestures into output stream
- Concept of levels and layers in FMs

Connecting view objects to app object
-------------------------------------
- Or to other view objects
- Idea of objects emitting data, and other objects accepting it - fits with standard observer pattern
- Views observe model
- Model observes views to get inputs
- Better if neither knows about the other - independent components
- Page can act as a glue or link layer
- Web or model components just have functions that accept data
- If just one data value into single arg, they can be setters - good idea?
- Something needs to set up a watcher on source to detect changes and call the setter/input function on the other component
- May want to link app objects together as well - to reuse business logic components
- Wiring means wiring - components don't know what is at other end
- In code, have a link function or send(x, name).to(y, name) - can use func or setter
- Objects could have an observer wrapper that has properties that are observer helpers
- An observer helper can take object and prop name, or object.function and call it - so have refactorable sourceObj.obs.foo.sendTo(targetObj.inputFn)
- In HTML, target object attribute has an expression in {{}} that defines what its source is - up to container to find and wire it up
- Or maybe view app controls wiring to app - components send events with action name and data, app manager routes to app
- Event bubbling seems v convenient as don't have to pass through all layers and can have input components anywhere
- Entity view/update component could raise event called 'updateAccount' which matches name of input method on app object
- *No* two-way binding: changes flow down, updates go right back up to top of app

Rendering and reacting
----------------------
- Display only component for a model object with properties can just re-render when model changes
- Form component cannot re-render as needs to leave its input elements in place and update their values
- May rely on entity object instance staying the same, so form view will not re-render
- Components inside the form view will re-render themselves when their value changes
- Input components should have special processing to deal with value changes and user inputs interacting
- SO: each view component has to receive updates to its value
- Poss:
  - Container responsible for pushing updates to its descendants - but it doesn't know anything about them
  - Many lower-level components need to know their path so can send it with events, so could also get watcher from container model
    - but value and property name are really separate concerns - the value may come from somewhere else
  - Display-only components just need to know their value
  - ${} in template evaluated only when rendered - relative to component value
  - web component finds {{}} in attribute value and asks environment to set up observer on *container* value property to set value on itself
    - good because it is the web component's own responsibility to find its value
    - good because not tied into any framework
    - bad because it only works with web components that co-operate
    - should it search up tree until finds something?
  - container looks for {{}} in an attr value of a web component in its HTML and finds property and sets up observer to set value on the web component  
    


Implementation
--------------
- Unknown elements are stripped from places they are not allowed (eg inside select), but text nodes remain
- Text nodes can be found with jQuery contents and a node type filter
- Table does not allow text inside the tbody - moves it to outside the table
- Random JS idea: pass a function to a property which is evaluated each time by the getter, simulates by value expressions

Web component views
-------------------

- Instead of a functional model that spits out arbitrary HTML to be rendered separately, have a web component that is a functional model
- Can't put arbitrary bits of text in text elements or attributes, but maybe that is not a bad thing
- The web component may observe one or more sequences
- It fills itself with HTML when it gets a value
- The HTML could come from a ES6 templated string
- The HTML can use other functional web components
- It may update its HTML rather than overwriting it if that is more efficient
- A view component is just one that renders something - model components may only render themselves for debugging
- Maybe all components are written as plain, and optionally wrapped into web components - then can use server side or client side
- Remove listeners on data sequences in detachedCallback
- Element attributes can bind to data by dotted path - with or without {{}}
- Resolve objects any way you like - by properties on element hierarchy, by window level vars, by id of objects, by tag name of objects 
- Implementation: unclear when properties of custom element are available - don't seem to be in document ready, but they are in a script at end of body
- Create DataSequences that automatically listen for certain events
- Defining HTML in JS - some don't like, but often embed languages together, and allows to see template with view model it uses

Using components outside page
-----------------------------
- Best if view components separate to web components but wrapped for use on page
- App components will also be wrapped for use on page
- So long as can provide HTML and output events, could use in different ways
- Also good if can use server side to generate HTML
- Choice: recursively expand web component elements to their HTML OR output HTML that uses web components
- Could use client side to generate PDF?

Separating view component and web component wrapper
---------------------------------------------------
- A view component in any environment needs to:
  - Know its model object
  - Know its fixed settings
  - Produce HTML
- A view component in a browser environment needs to:  
  - Know the app (maybe)
  - Get notified of events bubbling up to it and respond
  - Be able to raise events
  - Be able to listen to global events (maybe) 
- Basic view component does not need to listen to property changes - handled by environment/wrapper
- Event handlers can be functions: named after event eg onChange, pass in data and actual event
- May choose to store internal state in response to an event? - may be no other sensible way
- If an event handler returns a value - that is an event to be raised
- !!BUT if component knows about app, it breaks the independent component approach
- May aid design to think this way - or just make more complicated?
- View components classes could extend others if not web components
- May aid testing - can unit test outside browser!
- Does *not* know about contained components or elements - they are just like any other separate component
- So need a way to communicate: mechanism to wire in components to container and raise events
- Can generate a web component class by function from another class in plain JS - no parsing required


Form views
----------
- Should only send up changed values
- Don't need to know contained elements - just accept events
- Store updated values from event

View app, navigation, routing
-----------------------------
- Need to have routing - expected 
- Maybe have an app manager component as top level 
- Has settings and/or slots to plug in other stuff - bit like a motherboard
- Normally set to fill whole page but could run multiple
- Connected explicitly to an app instance
- Controls navigation and routing
- Needs to know what its root URL path is to know where to start
- Contains routing items, plus grouping and separator items
- A routing item has a label, a path segment and a component name to use
- View app displays routing items in a menu and when clicked, adds history item with path
- When location changed, finds component with longest path and displays its component, passing in rest of path
- Could have favourites widget added if want to

List-entity view
----------------
- May be for top-level entities, inside the  app view, or for repeating groups inside other entity views
- Combine a list view and an entity view
- Later: different entity views for different types of entity in list
- Or may have a central mapping between entity class name and view name, or a naming convention eg <account-view>
- Need to attach to model and a certain property of it
- Need a template for the list items - could default to a component with a naming convention eg <account-list-item>
- Needs to work with path and know which attribute of entity it specifies
- May want search/filter

Entity view
-----------
- Needs to be attached to a model object - the entity
- On form submit, needs to send the form data to the updateXxx method on the app
- Could use event, send to parent, or call direct
- Event makes it asynchronous, which could be good, and can pass up from deep level
- Event also sticks to component wiring rule - don't care where output wired to
- No return value, but updates will filter down to watched items

Report view
-----------
- Need to set parameters for many report-type views- what is responsible for that, and updating?
- Good if view updated instantly as params changed on page
- When params form submit, need to either update existing view object, or get a new one by calling the app
- There is a return value from the app method to create a view object
- View object creator functions don't need to be called by data updates, so could have multiple params - but all in one obj anyway
- View objects could have properties, like entities do, and respond to changes by updating its functional properties
- Changes and memoization local to the view object BUT still need to respond to changes in app
- Seems much simpler to just create a new view object every time the params change
- Could memoize on the param values
- So report view has to call method on app direct when form submitted, and use return value to update its output object
- This also fits better with other UI models, such as getting parameters and then moving to view

Update granularity
------------------
- Consider how updates work to an object that has simple properties and also derived views - like account with balance and transactions
- May just get sequence of account versions, and redo all of it
- Or account may contain multiple sequences - the info details are one update block, and the transaction list another
- Poss: Entity instances are static, but contain sequences for parts of themselves
- Attach a component to one of the sequences, to be fully redrawn when it changes

Asynchronous updates
--------------------
- The calculation overhead could often be long enough to freeze the UI
- May need to trigger all watchers to do calcs in background, them notify UI when done
- How transfer data between UI thread and worker?
- Poss: copy data model to worker, copy all watcher paths, copy memoization cache back


Why not Polymer
---------------

- Use Polymer?  Maybe, but it has a lot we don't need, like two-way binding
- Heavyweight
- Need to use templates
- Data binding syntax very clunky


Resolving model objects
-----------------------

- Need to decide where to convert sequences to latest values to use in views
- Probably as late as possible - maybe in observer that triggers view

UI ideas
--------
- Scrolling list plus selected one pattern
- Search fixed at top of list
- Shift-click to open multiple tabs on view side