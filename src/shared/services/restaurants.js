import axios from 'axios';
import { buildUrl } from './index';

// export const getRestaurants = () => axios.get(buildUrl('/restaurants'));
export const getRestaurants = (payload) =>
  //   axios.get(buildUrl(`/restaurants/${payload[0]}/${payload[1]}/${payload[2]}/${payload[3]}`));
  axios.get(buildUrl(`/restaurants/${payload[0]}/${payload[1]}/${payload[2]}/${payload[3]}`));
