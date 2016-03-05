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
- A view component also has an eventsRequired property and a method to call with events 


Resolving model objects
-----------------------

- Need to decide where to convert sequences to latest values to use in views
- Probably as late as possible - maybe in observer that triggers view