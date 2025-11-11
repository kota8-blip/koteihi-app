import request from "../utils/request";

export const past = (user_id) => {
  return request({
    url: `/past`,
    method: 'GET',
    params: { user_id },
  })
}
