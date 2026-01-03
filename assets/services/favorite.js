import request from "../utils/request";

export const favoriteItems = (user_id) => {
  return request({
    url: `/favorites`,
    method: 'GET',
    params: { user_id },
  })
}

export const addToFavorite = (item) => {
  return request({
    url: `/favorites`,
    method: 'POST',
    data: item,
  })
}

export const updateFavorite = (id, item) => {
  return request({
    url: `/favorites/${id}`,
    method: 'PUT',
    data: item,
  })
}

export const deleteFavorite = (id) => {
  return request({
    url: `/favorites/${id}`,
    method: 'DELETE',
  })
}
