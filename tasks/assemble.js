var path = require('path');
var _;
var expand;
var write;

// p = /node_modules/topcoat-button/index.html
// => topcoat-button 
function dirName (p) {
	p = path.dirname(p).split(path.sep);
	return p[p.length-1];
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

function relativeCSSPath (file, options, grunt) {

	var cssPath;

	if (typeof options == 'string') {
		var match = expand(path.join(file + options[i]));
		cssPath = _.rest(match[0].split('/')).join('/');
	} else {
		for (var i = 0; i < options.length && !cssPath; ++i) {
			var match = expand(path.join(file + options[i]));
			if (match.length) {
				// drop the node_modules prefix
				cssPath = _.rest(match[0].split('/')).join('/');
			}
		}
		
	}

	return cssPath;

}

module.exports = function (grunt) {

	_ = grunt.util._;
	expand = grunt.file.expand;
	write = grunt.file.write;

	grunt.registerTask('assemble-build', 'Generates test pages', function () {

		var pkgOptions = grunt.file.readJSON('package.json').test;

		var options = {
			options: {
				prettify: {
					indent: 2
				},
				flatten: true,
				minified: true,
				layoutdir: 'templates',
				layout: 'layout.hbs',
				helpers: 'templates/helpers/*.js',
				instances: pkgOptions.telemetry.instances
			}
		};

		// components is an array that will contain all the files
		// that match the pattern specified in the package.json
		// they are the pages that will be build for testing
		var components = grunt.file.expand(pkgOptions.telemetry.files);
		components.forEach(function (c) {
			// FIXME -- too hacky

			// c = each file to be turned in a test page
			// cssPath = relative URL for the page css

			var cssPath = relativeCSSPath(c, pkgOptions.telemetry.css)
				, fname = 'perf/page_sets/topcoat/' + dirName(c)
				;

			createTelemetryJSON(dirName(c), pkgOptions.telemetry.minified);

			options[dirName(c) + '.html'] = {
				files: {},
				options: {
					style: cssPath
				}
			}
			options[dirName(c) + '.html'].files[fname] = c;
		});

		grunt.config('assemble', options);
		grunt.task.run('assemble');

		if (pkgOptions.telemetry.minified) {
			grunt.task.run('htmlmin');
		}

	});

}