import { AxiosError, AxiosPromise, AxiosResponse } from 'axios';
import * as base64 from 'base-64';
import { IHttp } from '../tools/request';
import ModelInstance, { IDataValues } from './ModelInstance';

export interface ICollectionResult {
	count: number;
	rows: ModelInstance[];
}

export default class Utility {
	private $basepoint: string;
	private $http: IHttp;

	constructor(basepoint: string, http: IHttp) {
		this.$basepoint = basepoint;
		this.$http = http;
	}

	public responseToInstances(requestInstance: AxiosPromise<any>): Promise<any> {
		requestInstance = requestInstance.then(this.handleTokenRenewal);
		return requestInstance.then((res) => ({
			count: res.data.count,
			rows: res.data.rows.map((row: IDataValues) => new ModelInstance(row, this.$basepoint, this.$http)),
		}));
	}

	public responseToInstance(requestInstance: AxiosPromise<any>): Promise<any> {
		requestInstance = requestInstance.then(this.handleTokenRenewal);
		return requestInstance.then((res) => new ModelInstance(res.data, this.$basepoint, this.$http));
	}

	public prepareCompletion<T>(
		requestInstance: AxiosPromise<any>,
		returnType: 'single' | 'collection' = 'single',
	): Promise<T> {
		if (returnType === 'single') {
			return new Promise((resolve, reject) => {
				this.responseToInstance(requestInstance)
					.then(resolve)
					.catch((err: AxiosError) => {
						if (err.response) {
							this.handleTokenRenewal(err.response);
							reject(err.response.data);
						} else {
							reject(err);
						}
					});
			});
		} else {
			return new Promise((resolve, reject) => {
				this.responseToInstances(requestInstance)
					.then(resolve)
					.catch((err: AxiosError) => {
						if (err.response) {
							this.handleTokenRenewal(err.response);
							reject(err.response.data);
						} else {
							reject(err);
						}
					});
			});
		}
	}

	public toBase64(s: string): string {
		return base64.encode(s);
	}

	private handleTokenRenewal(response: AxiosResponse<any>) {
		if (response) {
			const accessToken = response.headers['x-access-token'];
			const refreshToken = response.headers['x-refresh-token'];
			if (accessToken && refreshToken) {
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
			}
			return response.data;
		}
	}
}
