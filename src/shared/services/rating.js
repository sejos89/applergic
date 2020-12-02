import axios from 'axios';
import { buildUrl } from './index';

export const createRating = (payload) =>
  axios.post(buildUrl('/rating'), payload, { withCredentials: true });
