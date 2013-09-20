var grunt = require('grunt'),
	assert = require('assert');

describe('topcoat-grunt-telemetry', function () {

	'use strict';

	it('should generate the page sets json files', function () {

		var actual = grunt.file.expand('perf/page_sets/buttonindex.html.perf.html.json');
		assert.equal(actual.length, 1, 'there should be a json file');

	});

})