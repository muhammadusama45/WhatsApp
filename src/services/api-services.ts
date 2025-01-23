import axios, {AxiosError, AxiosInstance} from 'axios';
import {endpoints} from '../constants/endpoints';
import {FetchDataPayload} from '../types/request-payload';
import {PayloadType} from '../types/payload-types';
import {FetchDataResponse} from '../data/models/responses/fetch-data-responnse';
import {ResponseType} from '../types/response-types';
import {ErrorResponse} from '../data/models/responses/error-response';
type ApiTypes = 'fetchData';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
    });
  }
  ///////////////////////////////////////////
  private handleError = (
    error: AxiosError,
    apiType: ApiTypes,
  ): ErrorResponse => {
    if (error.response) {
      console.error(apiType, error.response.data);
      console.error(apiType, error.response.status);
      console.error(apiType, error.response.headers);
    } else if (error.request) {
      console.error(apiType, error.request);
    } else {
      console.error(apiType, error.message);
      return new ErrorResponse();
    }

    return new ErrorResponse();
  };
  ///////////////////////////////

  public safeApiCall = async <P extends PayloadType, R extends ResponseType>(
    payload: P,
    apiType: ApiTypes,
  ): Promise<R> => {
    switch (apiType) {
      case 'fetchData': {
        const response = await this.fetchData<FetchDataResponse>(
          payload as FetchDataPayload,
        )
          .then(response => {
            return new FetchDataResponse(response.data);
          })
          .catch((error: any) => this.handleError(error, apiType));
        if (response instanceof ErrorResponse) throw response;
        else if (response instanceof FetchDataResponse) {
          throw new ErrorResponse();
        }
        return response as R;
      }
    }
  };
  ///////////////////////////////////////////////
  private fetchData = async <R>(payload: FetchDataPayload) => {
    const res = await this.axiosInstance.get<R>(endpoints.getPosts, {});
    return res;
  };
}

export default new ApiService();
