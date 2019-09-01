import axios from 'axios';
import * as uuidv4 from 'uuid/v4';
import AuthProvider from './libs/AuthProvider';
import ModelFactory from './libs/ModelFactory';
import Request, { IHttp, IStorage } from './tools/request';

export interface IModelFactory {
	[k: string]: ModelFactory;
}

export default class Adapter {
	private $adapterId: string;
	private $backendURL: string;
	private $port: number;
	private $http: IHttp;
	private $storage: IStorage;
	private $models: IModelFactory;

	constructor(backendURL: string, port: number = 1234, storage: IStorage, adapterId: string = 'app') {
		this.$adapterId = adapterId;
		this.$backendURL = backendURL;
		this.$port = port;
		this.$http = Request(backendURL, port, storage, this.$adapterId);
		this.$storage = storage;
		this.$models = {};
	}

	public connect(): Promise<IModelFactory> {
		const { $backendURL, $port } = this;
		const url = `${$backendURL}${$port !== 80 ? `:${$port}` : ''}/app_meta`;

		return axios
			.get(url)
			.then((res) => res.data)
			.then(this._buildModel.bind(this));
	}

	public getAuthProvider() {
		return new AuthProvider('auth', this.$http, this.$storage, this.$adapterId);
	}

	private _buildModel(meta: any) {
		const { models = [] } = meta;
		models.forEach((model: { name: string; basepoint: string }) => {
			this.$models[model.name] = new ModelFactory(model.basepoint, this.$http, this.$storage, this.$adapterId);
		});
		return this.$models;
	}
}
