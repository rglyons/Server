## Postgres Solution

RESTful backend solution for Smart Irrigation to serve the web and mobile front-end applications - Postgres solution.

## App.js

App.js defines the Express application. This is where all requirements are stated, routes are referenced, and port listening is defined. The app listens to the port defined by the PORT environment variable, which is pre-defined on Heroku. 

## Environment Configuration

When running this app locally the PORT variable and production and development database URLs will all need to be defined in a local .env file. You will need to either create the .env file (for sandbox purposes), or get the standard .env file for the SproutLabs project from one of the team members. This file contains some sensitive information about our services and data stores, so we want to keep it safe.

## Sequelize

Sequelize is the ORM for this solution and the Postgres database. The file *server/models/index.js* initializes Sequelize and looks for 'use\_env\_variable' in the file *server/config/config.json*. This variable is initialized to the environment variable 'DEV\_DATABASE\_URL' or 'DATABASE\_URL', which are both defined as a Postgres database URL on the Heroku instance where this app is running. When running locally, 'DEV\_DATABASE\_URL' and 'DATABASE\_URL' must be initialized in a local .env file. The included .env file initializes these variables to the URLs of our develpment and production Postgres databases, respectively. Sequelize will connect to the database with the URL that is specified by the Node run scripts (this is discussed below, in 'Running Locally').

## Database Models

Models are defined through the Sequelize library and are located in *server/models*

**node.js** defines the attributes and relationships of the Node model and Nodes Postgres table. A node is a data representation of a single Slugsense device.

**reading.js** defines the attributes and relationships of the Reading model and Readings Postgres table. A reading is simply a collection of the values from all sensors on a node. 

**user.js** defines the attributes and relationships of the User model and Users Postgres table.

## Routing

Routes are defined in *server/routes/index.js*. This file defines the available routes, and the API functions that are called when the routes are visited. Also note that the HTTP request type is specified for each route, as different request types can be made to the same route and different API calls will be made. This file references the files in *server/controllers*, which define the API functions that are called when visiting the routes.

## Authentication

Most API endpoint call an authorization function. This function is defined in *server/auth/auth.js*. The *auth.js* file handles login and token authentication for users, so data is safer. **Note**: all requests to an endpoint that requires authentication must include a valid api token in the body of the HTTP request. 

## /frontend Directory

This directory is here so we are able to deploy our application on Heroku from a single repository. **Do not edit the files in the /frontend directory.** These files must be edited on the web application [front end](https://github.com/Ewocker/SmartIrrigation-Webapp) repo. Files on that repo are minified with a build script and injected into this repo in the */frontend* directory. 

## Running Locally

1. Download and install [Node.js]( https://nodejs.org/en/download/)
2. Update Node.js to v6.11.1, which is the latest LTS (Long Term Support) version of Node.js
 - [install](https://github.com/creationix/nvm#installation) nvm
 - run `nvm install 6.11.1`. This should install v6.11.1.
 - run `nvm use 6.11.1`.

3. Export the PORT, DEV\_DATABASE\_URL, and DATABASE_URL environment variables from the *.env* file by running `set -o allexport; source .env; set +o allexport`
4. To run the app with access to data in the development DB, run `npm run-script dev` (This command runs the *dev* script defined in *package.json*)
5. To run the app with access to data in the production DB, run `npm run-script prod` (This command runs the *prod* script defined in *package.json*). **Note**: Production data should not be edited when developing. If you need to add/change data for development testing purposes, run the application in development mode (refer to #4 above).