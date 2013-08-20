module.exports = function (grunt) {

	var _ = grunt.util._;

	grunt.registerTask('run', 'Run telemetry tests', function () {

		var args = _.toArray(arguments)
			, done = this.async()
			, pkgOptions = grunt.file.readJSON('package.json').test
			;

		if(args[0] == 'telemetry') {

			var exec = require('child_process').exec
				, commandToBeExecuted = 'python bin/runAll.py '
				, params = ['--type']
				;

			// If parameters are sent but do not match the expected number
			if (_.rest(args).length && _.rest(args).length != params.length) {
				grunt.log.warn('Invalid number of parameters');
				grunt.log.warn(params);
				done();
			} else {
				_.forEach(_.zip(params, _.rest(args)), function (param) {
					commandToBeExecuted += param.join('=') + ' ';
				});
				commandToBeExecuted += '--repeat=' + pkgOptions.telemetry.repeat;
			}

			exec(commandToBeExecuted, function(error, stdout, stderr) {
				if (error) {
					grunt.log.error('Error');
					console.log(error);
					done();
				} else {
					console.log(stdout);
					grunt.log.writeln('Done!');
				}
			});
		} else {
			grunt.log.warn('Other test frameworks not available');
			done();
		}


	});
}