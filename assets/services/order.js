import request from "../utils/request";

export const food = (user_id) => {
  return request({
    url: `/food`,
    method: 'GET',
    params: { user_id },
  })
}
