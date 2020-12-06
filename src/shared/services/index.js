import qs from 'qs';

const createQuery = (queryOptions) => (queryOptions ? qs.stringify(queryOptions) : '');

export const buildUrl = (url, queryOptions) => `/api${url}${createQuery(queryOptions)}`;
