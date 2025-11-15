// const express = require('express');
// const path = require('path');
// const app = express();

// app.use(express.static('dist'));

// // Handle any requests that don't match the ones above
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

import cors_proxy from './cors-anywhere.cjs';
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
cors_proxy
	.createServer({
		//  requireHeader: ['origin', 'x-requested-with'],
		originWhitelist: [], // Allow all origins
        requireHeader: [],
		removeHeaders: [
			'cookie',
			'cookie2',
			// Strip Heroku-specific headers
			'x-request-start',
			'x-request-id',
			'via',
			'connect-time',
			'total-route-time',
			// Other Heroku added debug headers
			// 'x-forwarded-for',
			// 'x-forwarded-proto',
			// 'x-forwarded-port',
		],
		redirectSameOrigin: true,
		httpProxyOptions: {
			// Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
			xfwd: false,
		},
	})
	 .listen(PORT, HOST, () => {
    console.log(`Running CORS Anywhere on ${HOST}:${PORT}`);
  });

// app.listen(3000, () => {
// 	console.log('Server is running on port 3000');
// });




