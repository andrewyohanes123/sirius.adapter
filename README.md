# sirius.adapter

sirius.adapter is a module to connect to a [sirius.js](https://github.com/EdgarJeremy/sirius.js)/[sirius.ts](https://github.com/EdgarJeremy/sirius.ts)-crafted backend. It automatically detects and provide a model representation to each models in the backend that can be used to manipulate the corresponding model. Making it a real-life ORM for the frontend.

sirius-connect also provide the ability to manage auth & session under-the-hood.

## Table of Contents

1. [Installation](#installation)
2. [Testing](#test)
3. [Concepts](#concept)
4. [Usage](#usage)
   -  [Initialization](#initialization)
   -  [Connecting to backend](#connecting-to-backend)
   -  [Fetching instances](#fetching-instances)
   -  [Creating a new instance](#creating-a-new-instance)
   -  [Manipulating instance](#manipulating-instances)
   -  [Options](#options)
   -  [Authorization](#authorization)
   -  [Error Handling](#error-handling)
5. [Using with another backend](#using-with-another-backend)

## Installation

Using _npm_

`npm install forked.sirius.adapter --save`

Using _yarn_

`yarn add forked.sirius.adapter`

Browser

You can use unpkg CDN to get sirius.adapter bundled script, and put it in your script tag.

-  [Uncompressed](https://unpkg.com/@edgarjeremy/sirius.adapter@latest/dist/standalone/sirius-adapter.js)
-  [Minified](https://unpkg.com/@edgarjeremy/sirius.adapter@latest/dist/standalone/sirius-adapter.min.js)

## Testing

All tests suits & mock can be found in the ./tests folder.

to run the tests simply run this command

`npm test`

## Concepts

The two main concept in this module are `ModelFactory` and `ModelInstance`.

A `ModelFactory` is an object that represents a table in the database. It can be use to create & fetch the `Instance`

While `ModelInstance` is an object that represents a row of a table in the database. It can be use to manipulate the corresponding row.

## Usage

**NOTICE : READ THE [CONCEPTS](#concepts) BEFORE PROCEEDING!**

### Initialization

First make an instance of a `SiriusAdapter` from a `SiriusAdapter` class.

```javascript
new SiriusAdapter(backendURL: string, port?: number)
```

Example

```javascript
import SiriusAdapter from 'forked.sirius.adapter';

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
	};
});
```

### Creating a new instance

Creating a new instance is pretty simple, take the `factories` object again, and using the model we prefer, we can simply call `.create()` and pass the desired data as a parameter.

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
	};
});
```

### Manipulating instances

We can update and delete an instance directly using the instance object.

```javascript
user.update(data: any): Promise<ModelInstance>;
user.delete(): Promise<ModelInstance>;
```

since the methods are called on the instance itself, it automatically knows the id of the instance and use that to tell the backend which row to manipulate.

### Options
You can define how the response will structured with the options object

Signature:
```javascript
options: {
	limit?: number;
	offset?: number;
	attributes?: string[];
	include?: ICollectionIncludeOptions[];
	order?: string[] | string[][];
}
```

### Authorization

Some of the action (fetching instances, creating a new instance, update & delete an instance) maybe requiring a client to be authorized. In order to do that, you need to authenticate before any action. You only do this once, and if its success, you can confidently proceed to your 'authentication-required' action.

First, you need to create an `AuthProvider` instance. To do that, just invoke the `.getAuthProvider()` methods on the `adapter` object.

Signature:

```javascript
adapter.getAuthProvider(): AuthProvider
```

Example :

```javascript
const authProvider = adapter.getAuthProvider();
```

**Authenticate**

To do an authentication, simply invoke the `.set()` method on the `authProvider` and pass the authentication data as a parameter. Remember, the data that you provide are depends on how your backend's login logic works.

Signature :

```javascript
authProvider.set(data: any): Promise<ModelInstance>
```

Example :

```javascript
authProvider.set({ username: 'lorem.ipsum.21', password: 'secret' })
    .then((loggedInUser) => {
        // loggedInUser will contain a ModelInstance corresponds to the matching user in the database
    }).catch((err) => {
        // error happens when the provided data is not matching with any rows in the database
    });
```

the `.set()` method will return a promise that resolves to a ModelInstance corresponds to a `User` found with the matching credentials or throw an error otherwise.

**Get user data**

After an authentication, a token & a refreshToken is generated. This two value is stored in the `localStorage` and used as a headers to each request so that the backend knows our client has been authenticated.

To get the `User` data, invoke `.get()` on the `authProvider` object.

Signature :

```javascript
authProvider.get(): Promise<ModelInstance>
```

Example :

```javascript
authProvider.get().then((loggedInUser) => {
    // loggedInUser will contain a ModelInstance that corresponds to a logged in user
}).catch((err) => {
    // no authentication has been invoked
});
```

**Remove the authentication data**

This could be done by invoking the `.remove()` methods on the `authProvider` object. This method's promise is always resolves.

Signature :
```javascript
authProvider.remove(): Promise<any>
```

Example :
```javascript
authProvider.remove().then(() => {
    // you are no longer to do the authentication-needed actions
});
```

### Error Handling

You can always catch every single methods on the `ModelFactory`,`ModelInstance` and `AuthProvider` and get a clear structured message on how the errors happens.


## Using with another backend

sirius.adapter can be used with another backend as long as the backend use the REST API endpoints concepts as wrote in this article.

[REST API best practices](https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09)