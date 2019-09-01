import axios, { AxiosPromise } from 'axios';

export interface IRequestOptions {
	params?: any;
	body?: any;
}

export interface IStorage {
	getItem(key: string): string | null | Promise<string> | Promise<null>;
	setItem(key: string, value: string): void | Promise<void>;
	removeItem(key: string): void | Promise<void>;
}

export type IHttp = (
	route: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	options?: IRequestOptions,
) => AxiosPromise<any>;

export type IRequest = (backendURL: string, port: number, storage: IStorage, adapterId: string) => IHttp;

const Request: IRequest = (backendURL: string, port: number = 1234, storage: IStorage, adapterId: string) => {
	const baseURL = `${backendURL}${port !== 80 ? `:${port}` : ''}/api/`;

	const http: IHttp = async (
		route: string = '',
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		options: IRequestOptions = {},
	) => {
		const accessToken = await storage.getItem(`${adapterId}_accessToken`);
		const refreshToken = await storage.getItem(`${adapterId}_refreshToken`);
		const config = {
			headers: { 'x-access-token': accessToken, 'x-refresh-token': refreshToken },
			params: options.params,
			withCredentials: true,
		};

		switch (method) {
			case 'GET':
				return axios.get(baseURL + route, config);
			case 'DELETE':
				return axios.delete(baseURL + route, config);
			case 'PUT':
				return axios.put(baseURL + route, options.body, config);
			case 'POST':
				return axios.post(baseURL + route, options.body, config);
		}
	};

	return http;
};

export default Request;
