import Adapter from '../src';
import ModelInstance from '../src/libs/ModelInstance';
import '../src/setupMocks';

const backendURL = 'https://sirius-ts.herokuapp.com';
const port = 80;
const adapter = new Adapter(backendURL, port);

describe('AuthProvider Test', () => {
	const provider = adapter.getAuthProvider();

	it('Can recognize a valid auth credentials', async () => {
		const authData = await provider.set({
			password: 'sherlocked',
			username: 'edgar',
		});
		expect(authData).toBeInstanceOf(ModelInstance);
	});

	it('Can get a valid auth information after set auth credentials', async () => {
		const authData = await provider.get();
		expect(authData).toBeInstanceOf(ModelInstance);
	});

	it('Can remove an auth information', async () => {
		const result = await provider.remove();
		expect(result).toBeTruthy();
	});

	it("Can throw an error when auth credentials haven't been set or have been removed", () => {
		expect(provider.get()).resolves.toHaveProperty('errors');
	});

	it('Can throw an error when auth credentials are invalid', () => {
		expect(provider.set({ username: '', password: '' })).resolves.toHaveProperty('errors');
	});
});
