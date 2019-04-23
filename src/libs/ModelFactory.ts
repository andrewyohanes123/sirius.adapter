import { IHttp } from '../tools/request';
import ModelInstance from './ModelInstance';
import Utility, { ICollectionResult } from './Utility';

export interface ICollectionOptions {
	limit: number;
	offset: number;
}

export default class ModelFactory {
	private $basepoint: string;
	private $http: IHttp;
	private $utility: Utility;

	constructor(basepoint: string, http: IHttp) {
		this.$basepoint = basepoint;
		this.$http = http;
		this.$utility = new Utility(basepoint, http);
	}

	public collection(options: ICollectionOptions) {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'GET', { params: { ...options } });

		return this.$utility.prepareCompletion<ICollectionResult>(requestInstance, 'collection');
	}

	public single(id: number) {
		const requestInstance = this.$http(`${this.$basepoint}/${id}`, 'GET');

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public create(data: any) {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'POST', { body: data });

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}
}
