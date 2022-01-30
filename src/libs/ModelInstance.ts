import { AxiosRequestConfig } from 'axios';
import { IHttp, IStorage } from '../tools/request';
import Utility from './Utility';

export interface IModelInstance<T = {}> {
	[k: string]: any;
}

export interface IDataValues {
	id: number;
	[k: string]: any;
}

export default class ModelInstance implements IModelInstance {
	public id: number;

	private $rawJSON: { [k: string]: any };
	private $basepoint: string;
	private $http: IHttp;
	private $utility: Utility;

	[k: string]: any;

	constructor(dataValues: IDataValues, basepoint: string, http: IHttp, storage: IStorage, adapterId: string) {
		this.$rawJSON = dataValues;
		this.$basepoint = basepoint;
		this.$http = http;
		this.$utility = new Utility(basepoint, http, storage, adapterId);
		this.id = dataValues.id;

		Object.keys(dataValues).forEach((key) => {
			this[key] = dataValues[key];
		});
	}

	public save(config?: AxiosRequestConfig) {
		const requestInstance = this.$http(`${this.$basepoint}/${this.id}`, 'POST', { body: this.rawJSON }, config);

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public update<T = any>(dataValues: T, config?: AxiosRequestConfig) {
		const requestInstance = this.$http(`${this.$basepoint}/${this.id}`, 'PUT', { body: dataValues }, config);

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public delete() {
		const requestInstance = this.$http(`${this.$basepoint}/${this.id}`, 'DELETE');

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public toJSON() {
		return this.$rawJSON;
	}
}
