var path = require('path');
var _;
var expand;
var write;

function checkDuplicates (pattern) {
	return function (p) {
		return path.basename(p).match(path.basename(pattern));
	}
}

// creates json file for Telemetry
var createTelemetryJSON = function (caseName, min) {

	var minified = min ? '.test.' : '';

	var jsonContent = {
		"description": caseName,
		"archive_data_file": "../data/" + caseName + ".json",
		"pages": [
			{
				"url": "file:///topcoat/" + caseName + minified + "html",
				"smoothness": {
					"action": "scroll"
				}
			}
		]
	};

	var jsonFilePATH = "perf/page_sets/" + caseName + '.json';

	write(jsonFilePATH,
		JSON.stringify(jsonContent, null, 4),
		'utf8');
};

function relativeCSSPath (file, options) {

	var cssPath = null;

	if (typeof options == 'string') {
		var match = expand(path.join(file + options[i]));
		cssPath = match.length ? match[0] : null;
	} else {
		for (var i = 0; i < options.length && !cssPath; ++i) {

			// console.log(expand(path.resolve(file + options[i])),expand(file + options[i]));
			
			var match = expand(path.join(file + options[i]));
			console.log(match);
			if (match.length) {
				cssPath = match[0];
			}
		}
		
	}

	if (!cssPath) {
		console.log('No CSS match for',file);
		return '';
	}

	return cssPath;
}

module.exports = function (grunt) {

	_ = grunt.util._;
	expand = grunt.file.expand;
	write = grunt.file.write;

	grunt.registerTask('assemble-build', 'Generates test pages', function () {

		var pkgOptions = grunt.config('telemetry');
		var assembleConfigs = grunt.config('assemble');
		var chromiumSrc = process.env.CHROMIUM_SRC;

		// assign the instances variable to assemble
		// that will include the variable several times
		// in the page
		assembleConfigs.options.instances = pkgOptions.instances;

		// components is an array that will contain all the files
		// that match the pattern specified in the package.json
		// they are the pages that will be build for testing
		var components = grunt.file.expand(pkgOptions.files);
		var copyOpt = grunt.config('copy');

		components.forEach(function (c, idx) {

			if (components.filter(checkDuplicates(c)).length > 1) {
				grunt.log.warn('You have multiple files with the same name');
				grunt.log.warn(components.filter(checkDuplicates(c)));
			}

			// c = each file to be turned in a test page
			// cssPath = relative URL for the page css

			var cssPath = relativeCSSPath(c, pkgOptions.css)
				, fname = 'perf/page_sets/topcoat/' + path.basename(c)
				;

			createTelemetryJSON(path.basename(c, '.html'), pkgOptions.minified);

			assembleConfigs[path.basename(c)] = {
				files: {},
				options: {
					style: cssPath
				}
			}
			assembleConfigs[path.basename(c)].files[fname] = c;
		});

		grunt.config('copy', copyOpt);
		grunt.config('assemble', assembleConfigs);
		grunt.task.run('assemble');

		if (pkgOptions.minified) {
			grunt.task.run('htmlmin');
		}

	});

}