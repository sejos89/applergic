import axios from 'axios';
import { buildUrl } from './index';

export const getUserProfile = () => axios.get(buildUrl('/user'), { withCredentials: true });

export const createUser = (payload) => {
  return axios.post(buildUrl('/user/register'), payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
};

export const checkUsername = (payload) => axios.get(buildUrl(`/user/checkUsername/${payload}`));

export const editUser = (payload) =>
  axios.put(buildUrl('/user/edit'), payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });

export const deleteUser = () => axios.delete(buildUrl('/user'), { withCredentials: true });

export const addRating = (payload) =>
  axios.put(buildUrl('/user/addRating'), payload, { withCredentials: true });

export const addDiary = (payload) =>
  axios.put(buildUrl('/user/diary'), payload, { withCredentials: true });

export const getDiary = (payload) =>
  axios.get(buildUrl(`/user/diary/${payload}`), { withCredentials: true });

export const deleteDiary = (payload) =>
  axios.put(buildUrl('/user/diary/delete'), payload, { withCredentials: true });

export const editNotesDiary = (payload) =>
  axios.put(buildUrl('/user/diary/notes'), payload, { withCredentials: true });

export const getFavorites = () => axios.get(buildUrl('/user/favorites'), { withCredentials: true });

export const addFavorite = (payload) =>
  axios.put(buildUrl('/user/favorites'), payload, { withCredentials: true });

export const deleteFavorite = (payload) =>
  axios.put(buildUrl('/user/favorites/delete'), payload, { withCredentials: true });

export const loginUser = (payload) =>
  axios.post(buildUrl('/user/login'), payload, { withCredentials: true });

export const logout = () => axios.get(buildUrl('/user/logout'), { withCredentials: true });

export const googleLogin = (payload) =>
  axios.post(buildUrl('/user/google'), payload, { withCredentials: true });
