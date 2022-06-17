
interface IParams {
  port: number;
}


class Config {
  readonly port: number;

  constructor(params: IParams) {
    this.port = params['port'];
  }
}

export default Config;
