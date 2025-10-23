const { BASE_URL } = process.env;
const backendUrl = BASE_URL || 'http://localhost:8080';
console.log('Using backend URL: ' + backendUrl);

module.exports = {
  '/alfresco': {
    target: backendUrl,
    secure: false,
    pathRewrite: {
      '^/alfresco/alfresco': ''
    },
    changeOrigin: true,
    onProxyReq: (request) => {
      if (request['method'] !== 'GET') {
        request.setHeader('origin', backendUrl);
      }
    }
  }
};
