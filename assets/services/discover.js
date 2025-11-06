import request from "../utils/request";

export const past = (params) => {
  return request({
    url: `/past`,
    method: 'GET',
    data: params,
  })
}
