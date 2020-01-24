import axios from 'axios';
import http from 'http';
import https from 'https';

// create custom axios wrapper
const request = axios.create({
  httpAgent: new http.Agent({ rejectUnauthorized: false }),
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  timeout: 2 * 1000
});

export default request;