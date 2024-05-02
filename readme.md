# Inventory management application

## A prototype of a inventory management application using node, express, and mongoDB

This is a prototype inventory management application created as an exercise in the utilisation of node.js express, mongodb, and various middleware.

In essence, it is a project aimed to solidify the knowledge gained during various courses in the subject of creating a full stack application, offering a tool to present various items and categories of items to the user, as well as providing the tools to add and remove items and categories on the go.

### A learning experience

This is a great exercise in the management of resources and keeping alot of moving parts together, as well as developing in a goal oriented manner, not taking on too many tasks at once, and reaching a end-product bit by bit.

Thanks to a solid seperation of concerns, various controllers, schemas, and models are modulated to provide easy to approach debugging as needed, and a pretty setup of the project.
The importance of such practice as a application scales and becomes large, is not missed on me.

### One schema, one module.

It's important to keep each schema seperated, so each model can be created from one module each. While it may seem cumbersome once alot of schemas are needed, it will show it's value as they are easy to find and diagnose as needed.

### One schema, one controller.

Each schema, and model gets it's own controller, this will allow all actions concerning that schema, in terms of GET and POST operations, to be programmed and stored, found and diagnosed easily.

Each of these controllers will handle both the GET and POST actions for various actions concerning the schema in question, seperated into a collection of exported asynchronous functions.
These are actions such as display all, display single, create, delete, and update.

The get events will manage presenting a relevant view to the user, containing a form for them to fill out and return, this will be done in a POST action that will initiate a function, converting the form to a relevant query to send to the database.

### How does it work?

The odin inventory management application, TOIMA? Is a simple prototype that presents the user with data stored in a mongoDB backend, leveraging the powerful tools of node.js and express, as well as various middleware, to present the inventory in stock (fictionally) to the user, and allowing said user to store, delete and edit any item and category at will.

WIP

![diagram of UML association between models](./public/diagrams/models-uml-association.drawio.svg)
