# Inventory management application

Welcome to The Odin Inventory Management Application, or TOIMA, a proof of concept prototype built to demonstrate the capabilities of a simple full-stack application utilizing Node.js, Express, and PostgreSQL.

The project serves as an exercise in applying these technologies to create an efficient inventory management system.

[Furthermore, this project is a refactoring of a earlier project built on the back of mongoDB of a similar name](https://github.com/DanishKodeMonkey/odin-inventory-application)

## Overview

TOIMA is a project I started as a way to solidify the fundamentals of full-stack development. From structuring the backend using Node.js and Express, to populating and managing data with PostgreSQL, this prototype encapsulates the essence of creating a functional and scalable application.

## A learning experience.

This project emphasizes solidifying my abilities in resource management, maintaining a balance between various components, and adopting a goal-oriented approach by breaking down tasks into manageable chunks. TOIMA demonstrates this step-by-step progression towards a fully realized application.

### Modular design

TOIMA’s architecture follows the principle of modularity, thanks to the skeleton framework established by Express, and a strict adherence to ensuring each component serves a distinct purpose. With each schema and controller for each model, the codebase remains organized and easy to navigate. This modular approach enhances maintainability, particularly as the application scales in complexity.

### Schema-Centric Controllers

In TOIMA, each schema is paired with a dedicated controller, streamlining CRUD operations for the corresponding model. Whether it's retrieval of data or updating records, these controllers provide a clear and concise interface for interacting with the database. By adhering to a one-schema, one-controller structure, TOIMA simplifies development and debugging tasks, and makes way for future features and improvements. While this project’s scope has been small, the approach can scale and tie to more and bigger data sets by adding more schemas and controllers as needed.

Diagram of UML association between models

![diagram of UML association between models](./public/diagrams/models-uml-association.drawio.svg)

### Routing with Express

Leveraging Express's routing module, TOIMA seamlessly connects the frontend and backend components. Through defined routes, users can access various functionalities of the application, including viewing inventory items, adding new categories, and more. This cohesive integration enables a smooth user experience.

### Presented using EJS

Thanks to the Embedded JavaScript templating engine, we are able to combine templates and our database data models to create actual HTML code to respond to the users' HTTP requests!

## How does it work?

TOIMA uses the combined power of PostgreSQL, Node.js, and Express to deliver a simple and seamless experience for organizing and manipulating inventory data. This project has served as a great experience to learn the capabilities of a well-organized full-stack project.

This project in particular was a great exercise in larger refactoring operations, having to dive back in to old code to refactor and optimize it to use data fetched from a postgreSQL database instead of a mongoDB one.

[Have a look here!](https://odin-inventory-application-psql.adaptable.app/)
