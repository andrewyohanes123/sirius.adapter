import axios, { AxiosPromise } from 'axios';

export interface IRequestOptions {
	params?: any;
	body?: any;
}

export type IHttp = (
	route: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	options?: IRequestOptions,
) => AxiosPromise<any>;

export type IRequest = (backendURL: string, port: number) => IHttp;

const Request: IRequest = (backendURL: string, port: number = 1234) => {
	const baseURL = `${backendURL}${port !== 80 ? `:${port}` : ''}/api/`;

	const http: IHttp = (
		route: string = '',
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		options: IRequestOptions = {},
	) => {
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');
		const config = {
			headers: { 'x-access-token': accessToken, 'x-refresh-token': refreshToken },
			params: options.params,
			withCredentials: true
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
