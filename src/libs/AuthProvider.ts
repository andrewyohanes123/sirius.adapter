import { IHttp } from '../tools/request';
import ModelInstance from './ModelInstance';
import Utility from './Utility';

export default class AuthProvider {
	private $basepoint: string;
	private $http: IHttp;
	private $utility: Utility;

	constructor(basepoint: string, http: IHttp) {
		this.$basepoint = basepoint;
		this.$http = http;
		this.$utility = new Utility(basepoint, http);
	}

	public get() {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'GET');

		return this.$utility.prepareCompletion<ModelInstance>(requestInstance, 'single');
	}

	public set(data: any) {
		const requestInstance = this.$http(`${this.$basepoint}/`, 'POST', { body: data }).then((res) => {
			const { tokens, user } = res.data.data;
			localStorage.setItem('accessToken', tokens.token);
			localStorage.setItem('refreshToken', tokens.refreshToken);
			return new ModelInstance(user, this.$basepoint, this.$http);
		});

		return requestInstance;
	}

	public remove() {
		return this.$http(`${this.$basepoint}/`, 'DELETE');
	}
}
