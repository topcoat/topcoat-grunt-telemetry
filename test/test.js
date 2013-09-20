var grunt = require('grunt'),
	assert = require('assert');

describe('topcoat-grunt-telemetry', function () {

	'use strict';

	it('should generate the page sets json files', function () {

		var telemetry = {
			parentDir: [
				"test/button/",
			],
			testPages: [
				"index.html"
			],
			css: [
				"/css/*mobile-dark.css"
			],
			instances: 400,
			minified: true,
			repeat: 1
		}

		grunt.config('assemble-build', telemetry);
		grunt.task.run('assemble-build');

	});

})