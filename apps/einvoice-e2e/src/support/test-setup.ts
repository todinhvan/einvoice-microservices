/* eslint-disable */
import axios from 'axios';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.BFF_HOST ?? 'localhost';
  const port = process.env.BFF_PORT ?? '4000';
  const globalPrefix = process.env.GLOBAL_PREFIX ?? 'api/v1';
  axios.defaults.baseURL = `http://${host}:${port}/${globalPrefix}`;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
};
