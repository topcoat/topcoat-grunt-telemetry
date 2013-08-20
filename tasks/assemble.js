var path = require('path');

var extractFileName = function (path) {
    if (path.split('/').length > 1) {
        sep = '/';
    } else if (path.split('\\').length > 1) {
        sep = '\\';
    } else {
        throw new Error('ERROR: the separator in test result file path is neither "/" nor "\\".');
    }
    return path.split(sep).pop().split('.')[0];
};

module.exports = function (grunt) {

	grunt.registerTask('assemble-build', 'Generates test pages', function () {

		var pkgOptions = grunt.file.readJSON('package.json').test;

		var options = {
			options: {
				prettify: {
					indent: 2
				},
				flatten: true,
				layoutdir: 'templates',
				layout: 'layout.hbs',
				helpers: 'templates/helpers/*.js',
				repeat: pkgOptions.telemetry.instances
			}
		};

		var components = grunt.file.expand(pkgOptions.telemetry.files);
		components.forEach(function (c) {
			fileName = extractFileName(c);
			options[fileName] = {
				files: {
					'perf/page_sets/topcoat/': c
				},
				options: {
					css: path.join(fileName, 'css', fileName + '.min.css')
				}
			}
		});
		console.log(JSON.stringify(options, null, 2));
		grunt.config('assemble', options);
        grunt.task.run('assemble');

	});

}