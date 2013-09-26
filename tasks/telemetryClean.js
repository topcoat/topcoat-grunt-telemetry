module.exports = function (grunt) {

	grunt.registerTask('cleanz', 'Clean telemetry tests', function () {

		var chromiumSrc = process.env.CHROMIUM_SRC;

		if (chromiumSrc == null) {
			
			grunt.task.run('src');

		} else {

			var opt = grunt.config('clean');
			var assemble = grunt.config('telemetry');

			opt.telemetry.src = opt.telemetry.src.concat([
				chromiumSrc + '/tools/perf/page_sets/topcoat',
				chromiumSrc + '/tools/perf/page_sets/topcoat_*.json',
			]);

			assemble.parentDir.forEach(function (path) {
				opt.telemetry.src.push(path + '/*.perf.*');
			});

			grunt.config('clean', opt);
			grunt.task.run('clean');

		}

	});
}