import request from "../utils/request";

export const food = (params) => {
  return request({
    url: `/food`,
    method: 'GET',
    data: params,
  })
}
