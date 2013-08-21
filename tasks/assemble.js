var path = require('path');

// p = /node_modules/topcoat-button/index.html
// => topcoat-button 
function dirName (p) {
	p = path.dirname(p).split(path.sep);
	return p[p.length-1];
}

// creates json file for Telemetry
var createTelemetryJSON = function (caseName, grunt) {

	var jsonContent = {
		"description": caseName,
		"archive_data_file": "../data/" + caseName + ".json",
		"pages": [
			{
				"url": "file:///topcoat/" + caseName + ".test.html",
				"smoothness": {
					"action": "scroll"
				}
			}
		]
	};

	var jsonFilePATH = "perf/page_sets/" + caseName + '.json';

	grunt.file.write(
		jsonFilePATH,
		JSON.stringify(jsonContent, null, 4),
		'utf8');
};

module.exports = function (grunt) {

	var _ = grunt.util._;

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

		console.log(pkgOptions.telemetry.instances);

		// components is an array that will contain all the files
		// that match the pattern specified in the package.json
		// they are the pages that will be build for testing
		var components = grunt.file.expand(pkgOptions.telemetry.files);
		components.forEach(function (c) {
			// FIXME -- too hacky

			// c = each file to be turned in a test page
			// cssPath = relative URL for the page css

			var cssPath = grunt.file.expand(path.join(c + pkgOptions.telemetry.css[0]));
			if(!cssPath.length)
				cssPath = grunt.file.expand(path.join(c + pkgOptions.telemetry.css[1]));

			var fname = 'perf/page_sets/topcoat/' + dirName(c);
			createTelemetryJSON(dirName(c), grunt);

			options[dirName(c) + '.html'] = {
				files: {},
				options: {
					style: _.rest(cssPath[0].split('/')).join('/')
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