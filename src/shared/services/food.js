import axios from 'axios';
import { buildUrl } from './index';

export const getFood = (id) => axios.get(buildUrl(`/food/${id}`), { withCredentials: true });

export const getAllFood = () => axios.get(buildUrl('/food/all'), { withCredentials: true });
