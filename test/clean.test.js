var grunt = require('grunt'),
	assert = require('assert');

describe('topcoat-grunt-telemetry', function () {

	'use strict';

	it('cleanup should work', function () {

		var actual = grunt.file.expand('perf/page_sets/*');
		assert.equal(actual.length, 0, 'there should no files');

	});

})