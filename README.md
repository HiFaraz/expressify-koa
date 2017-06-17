# expressify-koa

[![Greenkeeper badge](https://badges.greenkeeper.io/HiFaraz/expressify-koa.svg)](https://greenkeeper.io/)

[![Build Status][travis-image]][travis-url]

Expressify Koa is a simple converter that lets you use Koa 2.x middleware in Express.

  - **Migrate from Express to Koa gradually.**
  Application developers can gradually swap out Express/Connect-style middleware for Koa middleware

  - **Support both Express and Koa.**
  Package developers can support multiple frameworks without creating new framework-agnostic abstractions. Koa is already abstracts the Node.js HTTP requests and responses, so there is no need to create a new abstraction

The conversion is possible because Koa requests and responses are abstractions over Node.js-provided HTTP Requests and Responses

Ported from [Identity Desk](https://github.com/HiFaraz/identity-desk)'s multi-framework support module.

## Installation

```bash
$ npm install expressify-koa
```

## Express, meet Koa

```javascript
const express = require('express')
const expressify = require('expressify-koa')
const app = express()

app.get('/', expressify(function (ctx, next) {
  ctx.body = 'Hello World'
  return next()
}))

app.listen(3000)
```

## Using multiple Koa middleware

Expressify Koa only accepts a single Koa middleware. To attach multiple Koa middleware in series, use [`koa-compose`](https://github.com/koajs/compose) or a Koa-compatible router such as [`koa-router`](https://github.com/alexmingoia/koa-router)

## Response handling

This diagram contrasts how Koa and Expressify Koa handle middleware responses and control flow:

```
----------------------------------------------------------------------
|       Regular Koa app       |            Expressify Koa            |
----------------------------------------------------------------------
|                             |                                      |
|      middleware stack       |                                      |
|     built with `use()`      |                                      |
|                             |                                      |
|              ↓              |                                      |
|                             |                                      |
|    `callback()` combines    | accepts a single middleware function |
| the stack into one function |       (possibly pre-combined)        |
|                             |                                      |
|              ↓              |                  ↓                   |
|                             |                                      |
|    `respond()` converts     |    convert any response from Koa     |
|  Koa's `ctx.response` into  |       middleware on `ctx.body`       |
|      an HTTP response       |        into an HTTP response         |
|                             |                                      |
|              ↓              |                  ↓                   |
|                             |                                      |
|    `listen()` creates an    |      pass control to Express if      |
|         HTTP server         |        response still pending        |
|                             |                                      |
----------------------------------------------------------------------
```

## API

### expressify(middleware)

Convert `middleware` into Express middleware

## Running tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## Contributing

This project welcomes contributions from the community. Contributions are
accepted using GitHub pull requests; for more information, see 
[GitHub documentation - Creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

For a good pull request, we ask you provide the following:

1. Include a clear description of your pull request in the description
   with the basic "what" and "why"s for the request.
2. The tests should pass as best as you can. GitHub will automatically run
   the tests as well, to act as a safety net.
3. The pull request should include tests for the change. A new feature should
   have tests for the new feature and bug fixes should include a test that fails
   without the corresponding code change and passes after they are applied.
4. If the pull request is a new feature, please include appropriate documentation 
   in the `Readme.md` file as well.
5. To help ensure that your code is similar in style to the existing code,
   run the command `npm run lint` and fix any displayed issues.

## People

The lead author is [Faraz Syed](https://github.com/HiFaraz).

## License

[MIT](LICENSE)

[travis-image]: https://travis-ci.org/HiFaraz/expressify-koa.svg?branch=master
[travis-url]: https://travis-ci.org/HiFaraz/expressify-koa
