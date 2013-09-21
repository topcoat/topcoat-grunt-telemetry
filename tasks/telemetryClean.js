module.exports = function (grunt) {

	grunt.registerTask('cleanz', 'Clean telemetry tests', function () {

		var opt = grunt.config('clean');
		var assemble = grunt.config('telemetry');

		opt.telemetry.src = opt.telemetry.src.concat();
		assemble.parentDir.forEach(function (path) {
			opt.telemetry.src.push(path + '/*.perf.*');
		});
		grunt.config('clean', opt);
		grunt.task.run('clean');

	});
}