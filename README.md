# sirius.adapter
sirius.adapter is a module to connect to a [sirius.js](https://github.com/EdgarJeremy/sirius.js)/[sirius.ts](https://github.com/EdgarJeremy/sirius.ts)-crafted backend. It automatically detects and provide a model representation to each models in the backend that can be used to manipulate the representative model. Making it a real-life ORM for the frontend.

sirius-connect also provide the ability to manage auth & session under-the-hood.

## Table of Contents
1. [Installation](#installation)
2. [Testing](#test)
3. [Concepts](#concept)
4. [Usage](#usage)
    - [Initialization](#usage-initialize)
    - [Connecting to backend](#usage-fmf)
    - [Fetching instances](#usage-fmi)
    - [Creating new instance](#usage-cnmi)
    - [Manipulating instance](#usage-uai)
    - [Authorization](#usage-sad)
5. [Using with another backend]()

## Installation
Using *npm*

`npm install @edgarjeremy/sirius.adapter --save`

Using *yarn*

`yarn add @edgarjeremy/sirius.adapter`

## Testing
All tests suits & mock can be found in the ./tests folder.

to run the tests simply run this command

`npm test`

## Concepts
The two main concept in this module are `Factory` and `Instance`.

A `Factory` is an object that represents a table in the database. It can be use to create & fetch the `Instance`

While `Instance` is an object that represents a row of a table in the database. It can be use to manipulate a specific row.

## Usage
**NOTICE : READ THE [CONCEPTS](#concepts) BEFORE PROCEEDING!**

### Initialization
First make an instance of a `SiriusAdapter` from a `SiriusAdapter` class.

```javascript 
new SiriusAdapter(backendURL: string, port?: number)
```

Example

```javascript
import SiriusAdapter from 'sirius-adapter';

const adapter = new SiriusAdapter('localhost', 1234);
// or
const adapter = new SiriusAdapter('192.168.1.3', 1234);
// or
const adapter = new SiriusAdapter('https://sirius-backend.url', 80)

```

### Connecting to backend
Now that you've created an adapter instance, you can use that object to connect to the backend using the provided information before.

Invoke `.connect()` on the adapter. This method will return a promise that resolves to an object containing `ModelFactory` on each key (singular-capitalized table name), depending on your backend.

```typescript
adapter.connect(): Promise<{[key: string]: ModelFactory}>
```

```javascript
adapter.connect().then((factories) => {
    // `factories` will contain an object that has it keys depending on the specified backend. 
    /**
     * {
     *    User: ModelFactory,
     *    Token: ModelFactory,
     *    ...the rest of the models defined in the backend
     * }
    **/
});
```