# sirius.adapter

sirius.adapter is a module to connect to a [sirius.js](https://github.com/EdgarJeremy/sirius.js)/[sirius.ts](https://github.com/EdgarJeremy/sirius.ts)-crafted backend. It automatically detects and provide a model representation to each models in the backend that can be used to manipulate the corresponding model. Making it a real-life ORM for the frontend.

sirius-connect also provide the ability to manage auth & session under-the-hood.

## Table of Contents

1. [Installation](#installation)
2. [Testing](#test)
3. [Concepts](#concept)
4. [Usage](#usage)
   -  [Initialization](#usage-initialize)
   -  [Connecting to backend](#usage-fmf)
   -  [Fetching instances](#usage-fmi)
   -  [Creating new instance](#usage-cnmi)
   -  [Manipulating instance](#usage-uai)
   -  [Authorization](#usage-sad)
5. [Using with another backend]()

## Installation

Using _npm_

`npm install @edgarjeremy/sirius.adapter --save`

Using _yarn_

`yarn add @edgarjeremy/sirius.adapter`

Browser

You can use unpkg CDN to get sirius.adapter bundled script, and put it in your script tag.

-  [Uncompressed](https://unpkg.com/@edgarjeremy/sirius.adapter@latest/dist/standalone/sirius-adapter.js)
-  [Minified](https://unpkg.com/@edgarjeremy/sirius.adapter@latest/dist/standalone/sirius-adapter.min.js)

## Testing

All tests suits & mock can be found in the ./tests folder.

to run the tests simply run this command

`npm test`

## Concepts

The two main concept in this module are `Factory` and `Instance`.

A `Factory` is an object that represents a table in the database. It can be use to create & fetch the `Instance`

While `Instance` is an object that represents a row of a table in the database. It can be use to manipulate the corresponding row.

## Usage

**NOTICE : READ THE [CONCEPTS](#concepts) BEFORE PROCEEDING!**

### Initialization

First make an instance of a `SiriusAdapter` from a `SiriusAdapter` class.

```javascript
new SiriusAdapter(backendURL: string, port?: number)
```

Example

```javascript
import SiriusAdapter from '@edgarjeremy/sirius.adapter';

const adapter = new SiriusAdapter('localhost', 1234);
// or
const adapter = new SiriusAdapter('192.168.1.3', 1234);
// or
const adapter = new SiriusAdapter('https://sirius-backend.url', 80);
```

### Connecting to backend

Now that you've created an adapter instance, you can use that object to connect to the backend using the provided information before.

Invoke `.connect()` on the adapter. This method will return a promise that resolves to an object containing `ModelFactory` on each key (singular-capitalized table name), depending on your backend.

Signature

```typescript
adapter.connect(): Promise<{[key: string]: ModelFactory}>
```

Example

```javascript
adapter.connect().then((factories) => {
	// `factories` will contain an object that has it keys depending on the specified backend.
	// each key will contain a corresponding ModelFactory for that model

	factories = {
		User: ModelFactory,
		Token: ModelFactory,
		//...the rest of the models defined in the backend
	};
});
```

You might want to store this `factories` object into a state or pass to different module that will use that.

### Fetching instances

Using the `factories` that we've got from the previous `.connect()` method's promise, we can pull the `Instance` (data) for a specific model.

We can either get a set of data (collection) or a single one.

**Collection**

To get a collection of say, `User` Instance, invoke the `.collection()` method on the `User` Factory stored in the `factories` object.

Signature :
```javascript
factories[modelName]collection(): Promise<{count: number; rows: ModelInstance[]}>
```
Example :
```javascript
// after .connect() and resolve a factories object :

factories.User.collection().then((result) => {
    // result will contain an object with `count` and `rows` property
    // `count` will contain the number of rows found in the database
    // while `rows` will contain an array of ModelInstance

    result = {
        count: number,
        rows: ModelInstance[]
    }
});

```

**Single**

To get a single `User` Instance, invoke the `.single()` method on the `User` Factory stored in the `factories` object.

Signature :
```javascript
factories[modelName]single(id: number): Promise<ModelInstance>;
```
Example :
```javascript
factories.User.single(1).then((user) => {
    // `user` will contain a data of the user with the corresponding id provided in the .single() method
    // `user` also contain methods that can directly manipulate the corresponding user
    user = {
        id: number,
        save: () => ModelInstance,
        update: () => ModelInstance,
        delete: () => ModelInstance,
        // other user fields defined in the backend
    }
});
```

### Creating new instance
Creating new instance is pretty simple, take the `factories` object again, and using the model we prefer, we can simply call `.create()` using the desired data.

Signature :
```javascript
factories[modelName]create(data: any): Promise<ModelInstance>
```
Example :
```javascript
factories.User.create({
    name: 'Lorem Ipsum',
    username: 'lorem.ipsum.21',
    password: 'secret',
    // other fields
}).then((user) => {
    // the `user` will contain a ModelInstance corresponds to the newly created user with the provided data
    user = {
        id: number,
        name: string,
        username: string,
        password: string,
        // other fields
    }
});
```

### Manipulating instances

We can update and delete an instance directly using the instance object.

```javascript
user.update(data: any): Promise<ModelInstance>;
user.delete(): Promise<ModelInstance>;
```

since the methods are called on the instance itself, it automatically knows the id of the instance and use that to tell the backend which row to manipulate.