import qs from 'qs';

const REACT_APP_BACK_URL = '';
const createQuery = (queryOptions) => (queryOptions ? qs.stringify(queryOptions) : '');

export const buildUrl = (url, queryOptions) =>
  `${REACT_APP_BACK_URL}/api${url}${createQuery(queryOptions)}`;
