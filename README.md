# Northcoders News API

## Summary

This project is an API for Northcoders News. This server provides the user with information about various news articles, as well as comments left on those articles (and who wrote them). This backend can be interacted with to retrieve, post, patch, and delete various data.

The backend is hosted [here](https://nc-news-czlb.onrender.com/api)

## Prerequisites

Node.js and PostgreSQL must be installed in order to experiment with this project. The minimum versions are:

Node: v18.11.15 or newer
PostgreSQL: v14.8 or newer

(Older versions may work but compatibility can't be guaranteed)

## Setup

### 1. Clone the repo

Make a copy of the code by navigating to your folder of choice and entering the following into your terminal:

```shell
git clone https://github.com/hw04/nc-news-backend
```

### 2. Install all necessary packages

In your terminal:

```shell
npm install
```

Note: You must install node-postgres v8.7.3 or newer!

### 3. Create two .env files in the cloned folder so you can connect to the databases

```.env.development``` for the main database

```.env.test``` for the test database


### 4. Set the database names

In .env.development, enter:

```shell
PGDATABASE=nc_news
```

And in .env.test: 

```shell
PGDATABASE=nc_news_test
```

Note: ```nc_news``` and ```nc_news_test``` can be replaced with anything you like, provided they match what is written in ```/db/setup.sql``` (adjust these if necessary).

### 5. Create the databases

```shell
npm run setup-dbs
```

Add some data:

```shell
npm run seed
```

## Run the server!

Run the server locally:

```shell
npm start
```

You can use HTTP methods (GET, POST, PATCH, DELETE) on various endpoints (via Express) to interact with the database in some way. 

The endpoints can be queried through http://localhost:9090/ using a REST client.

GET requests can also be made using your browser.

If you perform a GET request to /api, you can see a list of the endpoints.

Alternatively, visit [https://nc-news-czlb.onrender.com/api](https://nc-news-czlb.onrender.com/api)

## Tests

The tests in this project were written using Jest, Jest Extended, Jest Ordered, and Supertest.

To run the development tests:

```npm test```

This seeds the test database with test data and refers to it for testing.
