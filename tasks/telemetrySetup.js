module.exports = function (grunt) {
	
	var prompt = require('prompt');
	var path = require('path');
	var parentFolder;
	var pagePattern;
	var cssPattern;

	grunt.registerTask('setup', 'Setup the paths to the pages which will be tested', function () {

		done = this.async();

		var msg = {
			properties: {
				path: {
					message: 'Path to folder you want to test (relative)',
					required: true
				}
			}
		};

		prompt.start();
		prompt.get(msg, getParentFolder);

		function getParentFolder (err, result) {

			var files = grunt.file.expand(path.join(result.path, '*.html'));

			parentFolder = result.path;

			if (!files.length) {
				console.log('The folder you specified does not contain any html files');
				done();
			} else {
				console.log('Here are all the html files: ');
				console.log();
				files.forEach(function (file) {
					console.log(file.split('/').reverse()[0].yellow);
				});
				console.log();
				
				var msg = {
					properties: {
						path: {
							message: 'Select a test page. Can be index.html or *.html for all',
							required: true
						}
					}
				};

				prompt.get(msg, getHTMLPages);

			}

		}

		function getHTMLPages (err, result) {

			var files = grunt.file.expand(path.join(parentFolder, '**/*.css'));
			pagePattern = result.path;

			if (files.length) {
				console.log('Here are the css files we found');
				console.log();
				files.forEach(function (file) {
					file = path.relative(parentFolder, file);
					console.log(file.yellow);
				});
				console.log();
			}

			var msg = {
				properties: {
					path: {
						message: 'Select a css file. Eg css/style.css',
						required: true
					}
				}
			};

			prompt.get(msg, getCSSFiles);

		}

		function getCSSFiles (err, result) {

			cssPattern = result.path;

			console.log(parentFolder, pagePattern, cssPattern);
			console.log('Configure the telemetry task from Gruntfile.js as follows'.yellow);
			config = {
				parentDir: [parentFolder],
				testPages: [pagePattern],
				css: [cssPattern],
				instances: 400,
				minified: true,
				repeat: 1
			}
			console.log(JSON.stringify(config, null, 2));

		}

	});

}
