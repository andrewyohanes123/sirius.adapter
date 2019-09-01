import { IHttp, IStorage } from '../tools/request';
import ModelInstance from './ModelInstance';
import Utility from './Utility';

export default class AuthProvider {
	private $basepoint: string;
	private $http: IHttp;
	private $storage: IStorage;
	private $utility: Utility;
	private $adapterId: string;

	constructor(basepoint: string, http: IHttp, storage: IStorage, adapterId: string) {
		this.$basepoint = basepoint;
		this.$http = http;
		this.$storage = storage;
		this.$utility = new Utility(basepoint, http, storage, adapterId);
		this.$adapterId = adapterId;
	}

	public get() {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'GET');

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public set(data: any) {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'POST', { body: data }).then(async (res) => {
			const { tokens, user } = res.data.data;
			await this.$storage.setItem(`${this.$adapterId}_accessToken`, tokens.token);
			await this.$storage.setItem(`${this.$adapterId}_refreshToken`, tokens.refreshToken);
			return new ModelInstance(user, this.$basepoint, this.$http, this.$storage, this.$adapterId);
		});

		return requestInstance;
	}

	public async remove() {
		await this.$storage.removeItem(`${this.$adapterId}_accessToken`);
		await this.$storage.removeItem(`${this.$adapterId}_refreshToken`);
		return this.$http(`${this.$basepoint}/`, 'DELETE');
	}
}
