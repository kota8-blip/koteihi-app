import request from "../utils/request";

export const cartItems = (user_id) => {
  return request({
    url: `/cartItems`,
    method: 'GET',
    params: { user_id },
  })
}
