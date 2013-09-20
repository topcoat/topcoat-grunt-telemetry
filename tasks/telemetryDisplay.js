module.exports = function (grunt) {

	var _ = grunt.util._;

	grunt.registerTask('display', 'Display telemetry tests', function () {

		var csv2JSON = require('../lib/csvToJSON.js');
		var files = grunt.file.expand(['/tmp/smoothness*', '/tmp/loading*']);
		var done = this.async();
		var l = files.length;

		files.forEach(displayResults);
		
		function displayResults (f) {
			csv2JSON(f, function (json) {
				grunt.log.ok('Test result: ' + f);
				if (f.match('smoothness'))
					displaySmoothness(json);
				else
					displayLoading(json);
				if (--l == 0) done();
			})
		}

		function displaySmoothness (json) {
			console.log('Mean frame time: '.yellow + json['mean_frame_time (ms)'] + ' ms');
			console.log();
		}

		function displayLoading (json) {
			console.log('Loading time: '.yellow + json['load_time (ms)'] + ' ms');
			console.log('Recalculate styles: '.yellow + json['RecalculateStyles (ms)'] + ' ms');
			console.log();
		}

	});
}