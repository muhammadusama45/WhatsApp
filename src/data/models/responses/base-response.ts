export type TBaseResponse<T> = {};

export class BaseResponse<T> {
  constructor() {}

  public toJson = (): TBaseResponse<T> => ({});
}
