## Postgres Solution

RESTful backend solution for Smart Irrigation to serve the web and iOS front-end applications - Postgres solution.

## App.js

App.js defines the Express application. This is where all requirements are stated, routes are referenced, and port listening is defined. The app listens to the port defined by the PORT environment variable, which is pre-defined on Heroku. When running locally the PORT variable will need to be defined in a .env file. This file will need to be created after cloning and **should be placed in a local .gitignore.**

## Sequelize

Sequelize is the ORM for this solution and the Postgres database. The file *server/models/index.js* initializes Sequelize and looks for 'use\_env\_variable' in the file *server/config/config.json*. This variable is initialized to the environment variable 'DATABASE\_URL', which is defined as the Postgres database URL on the Heroku instance where this app is running. When running locally, 'DATABASE\_URL' must be initialized in a local .env file. 

## Database Models

Models are located in *server/models* as **sensor.js** and **entry.js**. sensor.js defines the Sensor model and Postgres table, and entry.js defines a sensor reading of humidity, moisture, temperature, and sunlight. The sensor object has a one-to-many relationship with the entry model. 

## Routing

Routes are defined in *server/routes/index.js*. This file defines the available routes, and the API functions that are called when the routes are visited. Also note that the HTTP request type is specified for each route, as different request types can be made to the same route and different API calls will be made. This file references the files in *server/controllers*, which define the API functions that are called when visiting the routes.

Example API call (to Heroku instance): https://slugsense.herokuapp.com/api/sensors/all as a GET request will list all sensor objects in the database as well as each of their sensor reading entries.

## Running Locally

1. Download and install the following:
- Node.js: https://nodejs.org/en/download/
- Express: **after installing node** run `npm install --save express body-parser morgan`
- Sequelize: **after installing node** run `npm install -g sequelize-cli`
    - the -g flag installs sequelize globally. You can install it locally using the -D flag (instead of -g). The downside of doing this will be that you'll need to prefix every call to the sequelize command with `./node_modules/.bin`.
- Heroku CLI: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
2. clone the repo and navigate to *Node\_App/Postgres\_solution*
3. Run `heroku local web ` (This command examines the Procfile and performs the appropriate commands)

**Don't forget**: create a .env file in the root directory that defines DATABASE_URL and PORT