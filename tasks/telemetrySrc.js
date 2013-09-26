module.exports = function (grunt) {

	grunt.registerTask('src', "Check & store CHROMIUM_SRC env var", function() {

		var chromiumSrc = process.env.CHROMIUM_SRC;
		var prompt = require('prompt');

		if (!chromiumSrc) {
			console.log('CHROMIUM_SRC env var has not been set');
			var done = this.async();
			var msg = {
				properties: {
					path: {
						message: 'Path to telemetry src folder',
						required: true
					}
				}
			};
			prompt.start();
			prompt.get(msg, function (err, result) {

				if (!result.path.match(/(\/src\/{0,1})$/)) {
					grunt.log.error('CHROMIUM_SRC path not valid.');
					grunt.fail.warn('Path _must_ end in /src check again.');
					grunt.task.run('src');
					done();
				} else {
					console.log('Run this command in your terminal');
					console.log('export CHROMIUM_SRC=' + result.path);
					done();
				}
			});
		} else {
			if (!process.env.CHROMIUM_SRC.match(/(\/src\/{0,1})$/)) {
				grunt.log.error('CHROMIUM_SRC path not valid.');
				grunt.fail.warn('Path Must end in /src check again.');
				done();
			} else {
				grunt.log.writeln("CHROMIUM_SRC points to " + chromiumSrc.cyan);
			}
		}
	});

}