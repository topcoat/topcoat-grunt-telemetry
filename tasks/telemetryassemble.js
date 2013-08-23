var   path = require('path')
	, write
	;

// creates json file for Telemetry
var createTelemetryJSON = function (page, min) {

	var   jsonFilePATH = "perf/page_sets/" + name + '.json'
		, name = path.basename(page)
		, jsonContent = {
		"description": name,
		"archive_data_file": "../data/" + name + ".json",
		"pages": [
			{
				"url": "file:///topcoat/" + page,
				"smoothness": {
					"action": "scroll"
				}
			}
		]
	};

	write(jsonFilePATH,
		JSON.stringify(jsonContent, null, 4),
		'utf8');

};

module.exports = function (grunt) {

	write = grunt.file.write;

	grunt.registerTask('assemble-build', 'Generates test pages', function () {

		if (!chromiumSrc) grunt.task.run('src');

		var   pkgOptions  = grunt.config('telemetry')
			, copyOpt     = grunt.config('copy')
			, parentDir   = grunt.file.expand(pkgOptions.parentDir)
			, chromiumSrc = process.env.CHROMIUM_SRC || ''
			, assembleConfigs = grunt.config('assemble')
			;

		assembleConfigs.options.instances = pkgOptions.instances;

		parentDir.forEach(function (dir) {
			pkgOptions.testPages.forEach(function (pattern) {

				var matches = grunt.file.expand(dir + pattern);

				if (matches.length) {

					copyOpt.telemetry.files.push({
						src: dir,
						dest: path.join(chromiumSrc, '/tools/perf/page_sets/topcoat/')
					});

					matches.forEach(function (f) {

						createTelemetryJSON(f, pkgOptions.minified);
						assembleConfigs[path.basename(f)] = { files: {} }
						assembleConfigs[path.basename(f)].files[f + '.perf.html'] = f;

					});

				}
			});
		});

		grunt.config('copy', copyOpt);
		grunt.config('assemble', assembleConfigs);

		grunt.task.run('assemble');
		grunt.task.run('copy');

		if (pkgOptions.minified) {
			grunt.task.run('htmlmin');
		}

	});

};