var   path = require('path')
	, write
	;

// creates json file for Telemetry
var createTelemetryJSON = function (filename, min) {

	var name = path.basename(filename)
	var jsonFilePATH = "perf/page_sets/" + name + '.json'
	var jsonContent = {
		"description": name,
		"archive_data_file": "../data/" + name + ".json",
		"pages": [
			{
				"url": "file:///topcoat/" + filename,
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

function getCSSFile (dir, cssFiles) {
	return cssFiles.map(function (f) {
		return expand(dir + f)[0];
	}).filter(function (x) {
		return x;
	})[0];
}

module.exports = function (grunt) {

	write = grunt.file.write;
	expand = grunt.file.expand;

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
						expand: true,
						src: dir + '/**',
						dest: path.join(chromiumSrc, '/tools/perf/page_sets/topcoat/')
					});

					matches.forEach(function (f) {

						var filename = dir + path.basename(f) + '.perf.html';

						createTelemetryJSON(filename, pkgOptions.minified);

						assembleConfigs[path.basename(f)] = { files: {} }
						assembleConfigs[path.basename(f)].files[filename] = f;

						var css = getCSSFile(dir, pkgOptions.css);

						assembleConfigs[path.basename(f)].options = {
							style: path.relative(dir, css)
						}
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