import { IHttp, IStorage } from '../tools/request';
import Utility from './Utility';

export interface IModelInstance {
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

	constructor(dataValues: IDataValues, basepoint: string, http: IHttp, storage: IStorage = localStorage) {
		this.$rawJSON = dataValues;
		this.$basepoint = basepoint;
		this.$http = http;
		this.$utility = new Utility(basepoint, http, storage);
		this.id = dataValues.id;

		Object.keys(dataValues).forEach((key) => {
			this[key] = dataValues[key];
		});
	}

	public save() {
		const requestInstance = this.$http(`${this.$basepoint}/${this.id}`, 'POST', { body: this.rawJSON });

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public update(dataValues: any) {
		const requestInstance = this.$http(`${this.$basepoint}/${this.id}`, 'PUT', { body: dataValues });

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
