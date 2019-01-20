const localStorageMock = (() => {
	let store: { [k: string]: any } = {};

	return {
		clear: () => {
			store = {};
		},
		getItem: (key: string) => {
			return store[key] || null;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		setItem: (key: string, value: any) => {
			store[key] = value.toString();
		},
	};
})();

Object.defineProperty(global, 'localStorage', {
	value: localStorageMock,
});

jest.setTimeout(50000);
