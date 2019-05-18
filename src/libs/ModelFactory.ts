import { IHttp } from '../tools/request';
import ModelInstance from './ModelInstance';
import Utility, { ICollectionResult } from './Utility';

export interface ICollectionOptions {
	limit?: number;
	offset?: number;
	attributes?: string[];
	include?: ICollectionIncludeOptions[];
	order?: string[] | string[][];
	where?: {
		[s: string]: any;
	};
}

interface ICollectionIncludeOptions extends ICollectionOptions {
	model: string;
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

	public collection(options: ICollectionOptions = { attributes: ['id'] }) {
		if (options.attributes) {
			options.attributes.push('id');
		}
		const query: string = new Buffer(JSON.stringify(options)).toString('base64');
		const requestInstance = this.$http(`${this.$basepoint}/`, 'GET', { params: { q: query } });

		return this.$utility.prepareCompletion<ICollectionResult>(requestInstance, 'collection');
	}

	public single(id: number, options: ICollectionOptions = { attributes: ['id'] }) {
		if (options.attributes) {
			options.attributes.push('id');
		}
		const query: string = new Buffer(JSON.stringify(options)).toString('base64');
		const requestInstance = this.$http(`${this.$basepoint}/${id}`, 'GET', { params: { q: query } });

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public create(data: any) {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'POST', { body: data });

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}
}
