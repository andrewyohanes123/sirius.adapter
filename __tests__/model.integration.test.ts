import * as faker from 'faker';
import Adapter, { IModelFactory } from '../src';
import ModelInstance from '../src/libs/ModelInstance';
import '../src/setupMocks';

const backendURL = 'https://sirius-adapter-mock-server.herokuapp.com';
const port = 80;
const adapter = new Adapter(backendURL, port);

describe('Model Test', () => {
	let models: IModelFactory = {};
	let testInstance: ModelInstance;
	const testInstanceData = {
		name: faker.name.findName(),
		password: faker.internet.password(),
		username: faker.internet.userName(),
	};

	beforeAll(async () => {
		models = await adapter.connect();
	});

	it('Can build a valid model factories', async () => {
		expect(models).toBeDefined();
		expect(models).toHaveProperty('User');
		expect(models).toHaveProperty('User.collection');
		expect(models).toHaveProperty('User.single');
		expect(models).toHaveProperty('User.create');
		expect(models.User.collection).toBeInstanceOf(Function);
		expect(models.User.single).toBeInstanceOf(Function);
		expect(models.User.create).toBeInstanceOf(Function);
	});

	it('Can get a collection of a valid model instances', async () => {
		const collection = await models.User.collection();
		expect(collection).toHaveProperty('count');
		expect(collection).toHaveProperty('rows');
		expect(typeof collection.count).toBe('number');
		expect(collection.rows).toBeInstanceOf(Array);
		if (collection.rows.length > 0) {
			expect(collection.rows).toEqual(expect.arrayContaining([expect.any(ModelInstance)]));
		}
	});

	it('Can create a model instance', async () => {
		const instance = await models.User.create(testInstanceData);

		testInstance = instance;

		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(ModelInstance);
		expect(instance).toHaveProperty('id');
		expect(instance).toHaveProperty('name', testInstanceData.name);
		expect(instance).toHaveProperty('username', testInstanceData.username);
		expect(instance).toHaveProperty('password');
	});

	it('Can get a single valid model instance', async () => {
		const instance = await models.User.single(testInstance.id);

		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(ModelInstance);
		expect(instance).toHaveProperty('id', testInstance.id);
		expect(instance).toHaveProperty('name', testInstanceData.name);
		expect(instance).toHaveProperty('username', testInstanceData.username);
		expect(instance).toHaveProperty('password');
	});

	it('Can update a model instance', async () => {
		const editData = {
			name: faker.name.findName(),
			password: faker.internet.password(),
			username: faker.internet.userName(),
		};
		const editedInstance = await testInstance.update(editData);

		expect(editedInstance).toBeInstanceOf(ModelInstance);
		expect(editedInstance).toHaveProperty('id', editedInstance.id);
		expect(editedInstance).toHaveProperty('name', editData.name);
		expect(editedInstance).toHaveProperty('username', editData.username);
		expect(editedInstance).toHaveProperty('password');
	});

	it('Can delete a model instance', async () => {
        const deletedInstance = await testInstance.delete();
        
		expect(deletedInstance).toBeInstanceOf(ModelInstance);
	});
});
