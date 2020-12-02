import axios from 'axios';
import { buildUrl } from './index';

export const getAllergens = () => axios.get(buildUrl('/allergens'));
