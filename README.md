# black-gold
A small API to get information about that liquid black gold that most developers are completely hooked on.

## Table of Contents

- [Development Installation](#Development%20Installation)
- [Exposed Resources](#Exposed%20Resources)
- [Testing](#Testing)
- [Production Ready](#Production%20Ready)
- [Authors / Contributors](#authors-contributors)
- [Why this?](#Why%20this)

<a name="Development Installation"></a>
## Development Installation

1. Clone the repository:

  ```bash
  $ git clone https://github.com/iShuga139/black-gold.git
  $ cd black-gold
  ```

2. Install dependencies:

  ```bash
  $ npm install
  ```

3. Run the application:

  ```bash
  $ npm start
  ```

<a name="Exposed Resources"></a>
## Endpoints

### -> /
Home route that provides a friendly message

Request
```bash
$ curl localhost:3000/
```

Response
```bash
Welcome to Liquid Black Gold's information
```

### -> /beans/varieties
Returns a list of Coffee Arabica varieties

* Options on query params:
  - filters (required as string value delimited by two points and concatenated by `AND` operator)

* Valid filters to use
  - name (e.g.: name:Batian)
  - bean_size (e.g.: bean_size:VERY_LARGE)
  - quality_potential ( e.g.: quality_potential:VERY_GOOD)
  - yield (e.g.: yield:HIGH)
  - leaf_rust (e.g.: leaf_rust:TOLERANT)
  - coffee_berry_disease (e.g.: coffee_berry_disease:RESISTANT)
  - nematodes (e.g.: nematodes:SUSCEPTIBLE)
  - producing_countries (as String delimited by comma, e.g.: producing_countries:Brazil,Mexico,Colombia)

*NOTE*: Encode the url if you use curl

#### GET /beans/varieties
Returns a list of all varieties

```bash
$ curl -i -X GET 'http://localhost:3000/beans/varieties'
```

Response
```bash
Not available
```

#### GET /beans/varieties?filters=....
Returns a list with the filter varieties

```bash
$ curl -i -X GET 'http://localhost:3000/beans/varieties?filters=yield:HIGH%20AND%20name:Batian%20AND%20leaf_rust:TOLERANT%20AND%20coffee_berry_disease:RESISTANT%20AND%20producing_countries:Kenia'
```

Response
```bash
[
  {
    "name": "Batian",
    "bean_size": "VERY_LARGE",
    "quality_potential": "VERY_GOOD",
    "yield": "HIGH",
    "disease_resistancy": [
      {
        "leaf_rust": "TOLERANT"
      },
      {
        "coffee_berry_disease": "RESISTANT"
      },
      {
        "nematodes": "SUSCEPTIBLE"
      }
    ],
    "producing_countries": [
      "Kenia"
    ]
  }
]
```

<a name="Testing"></a>
## Testing

The API uses Mocha as a testing framework and Sinon for the external systems simulation. Tests should be written on the tests directory.

To test the API Framework runs from the root of the project:

```bash
$ npm test
```

You can get a coverage report using:

```bash
$ npm run coverage
```

You can see the coverage results using:

```bash
$ npm run coverage:open
```

<a name="Production Ready"></a>
## Production Ready

Create ENV variables
```
SERVICE_PORT = 4000
TLS_ENABLED = true
```
* Remember that you have to configure the certificates if you want to use TLS_ENABLED as `true` in the `/usr/src/ssl` path.

or you can executes the following:

```bash
$ docker build -t black-gold .
```

and deploy the docker image or run it with:

```bash
$ docker run -p 4000:4000 -d black-gold
```

<a name="authors-contributors"></a>
## Authors / Contributors

- **Author:** Jonathan Estrada - <jeaworks@hotmail.com>

- **Contributors:**

<a name="Why this?"></a>
## Why this

This is a great and simple API, I decided to build it using Express, Mocha, NYC and Docker.
I defined an idiomatic structure and intuitive code.

The main complex logic is in the filters.
Given that there is a defined JSON as a source of data. I collected the keys and difined them as a set of constants to make the search simpler.

Because I wanted to make the search user friendly, instead of doing the request as: `?filters=disease_resistancy.coffee_berry_disease:RESISTANT` we can make the search by any property directly like: `?filter=coffee_berry_disease:RESISTANT`. This is something that has to be discuss and agreed with all the users of the API. 

I like this approach because it reduces the cost of having to iterate through all the JSON, in this case I think is not needed because there is a small set of keys.

When I validate the request's filters I mutate the request object to add a property that contains the structure of keys obtained from filters that I later use in the logic to make the search of elements.

I use the option `filter` from `lodash` because it already gives us what we need and its very effective.