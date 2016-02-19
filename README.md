League Table Calculator
=======================

A proof-of-concept for a *stateless model* approach to application development.

Background
----------

Functional programming is concerned with defining programs as mappings from inputs to outputs.
This is fine for programs that take one set of inputs, run and produce one set of outputs.  
But most real world applications need to run over a period of time, take inputs one at a time and update the output after each input.
A traditional object-oriented approach would build up a model with mutable objects, and update the state of those objects to reflect each input.
A functional programming approach cannot have mutable state, so the usual proposal for dealing with it is to define the program as a function that
takes an input and an old immutable state, and outputs a new immutable state.

The approach proposed here is to have no explicit state in the program, and simply define how each part ot the output is calculated from the inputs
if they are all available together.  If a new input arrives, the outputs are all recalculated.  This could "obviously" be inefficient,
so this application explores how inefficient it is, and what can be done to improve that without the programmer having to worry about it.

The problem domain
------------------

This example application calculates the standings in an English football league from individual match results.
The rules are explained [here](https://en.wikipedia.org/wiki/Premier_League#Competition) but it is basically 3 points for a win, 1 point for a draw, none if you lose.
The results for the 2013-14 season are shown in this [table](https://en.wikipedia.org/wiki/2013%E2%80%9314_Premier_League#League_table).
It is simple to understand, interesting to many people, and not actually that different to many "serious" domains.  
Business bookkeeping, for example, is basically a matter of taking in individual movements of money and summarising them in a balance sheet, profit and loss or other reports.

The application
---------------
The results can be entered in CSV format, one at a time or many at a time.
The results are calculated by a function that breaks down into smaller functions.
