import {fetchDataDto} from '../data/models/dtos/fetchdata-dto';
import {BaseResponse} from './base-response';

export class FetchDataResponse extends BaseResponse<fetchDataDto> {
  constructor(response: FetchDataResponse) {
    super();
  }
}
