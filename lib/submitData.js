/*
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function settings (contentLength) {
	var post_options = {
		host: 'localhost',
		port: '3000',
		path: '/v2/benchmark',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': contentLength
		}
	};

	return post_options;
}

var submitData = function (stdout, path, args, destination) {
	var querystring = require('querystring');
	var http        = require('http');
	var fs          = require('fs');
	var parse       = require('./csvToJSON');
	var fileName	= require('./extractFileName.js');

	var post_data = {};
	parse(path, function (j) {
		post_data = {
			resultName : j
		};

		var version = stdout.split(' ');

		if (args.type == 'snapshot') {
			post_data.date = new Date().toISOString();
			post_data.commit = args.group || new Date().toISOString();
		} else {
			post_data.commit = version.shift();
			post_data.date   = version.join(' ');
		}
		post_data.test   = args.test || fileName(path);
		post_data.device = args.device || 'device?';
		post_data = querystring.stringify({data : JSON.stringify(post_data)});
		post_options = settings(post_data.length);
		if (destination.host && destination.port) {
			var location = destination.host.split('/');

			post_options.host = location.shift();
			post_options.port = destination.port;
		}
		// Set up the request
		console.log(post_data);
		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log(chunk);
			});
		});

		// post the data
		post_req.write(post_data);
		post_req.end();

	});

};

module.exports = submitData;