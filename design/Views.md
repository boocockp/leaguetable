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
- Remove listeners on data sequences in detachedCallback
- Element attributes can bind to data by dotted path - with or without {{}}
- Resolve objects any way you like - by properties on element hierarchy, by window level vars, by id of objects, by tag name of objects 
- Implementation: unclear when properties of custom element are available - don't seem to be in document ready, but they are in a script at end of body
- Create DataSequences that automatically listen for certain events

Update granularity
------------------
- Consider how updates work to an object that has simple properties and also derived views - like account with balance and transactions
- May just get sequence of account versions, and redo all of it
- Or account may contain multiple sequences - the info details are one update block, and the transaction list another
- Poss: Entity instances are static, but contain sequences for parts of themselves
- Attach a component to one of the sequences, to be fully redrawn when it changes


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