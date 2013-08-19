var chromiumSrc = process.env.CHROMIUM_SRC || ''
	, prompt = require('prompt')
	, path = require('path')
	;

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			telemetry: {
				files: [
					{ expand: true, src: ['perf/**'], dest: path.join(chromiumSrc, '/tools/') },
					{ expand: true, cwd: 'node_modules', src: ['topcoat-*/**'], dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/') }
				]
			}
		},
		clean: {
			telemetry: {
				src : ['perf/page_sets/*', chromiumSrc + '/tools/perf/page_sets/topcoat', chromiumSrc + '/tools/perf/page_sets/topcoat_*.json'],
				options: {
					force: true
				}
			}
		}
	});

	grunt.loadTasks('tasks/');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['src', 'generate', 'copy']);

	grunt.registerTask('run', 'Run telemetry tests', function () {
		var exec = require("child_process").exec,
            commandToBeExecuted = 'python bin/runAll.py --platform=mobile --theme=light --type=snapshot',
            done = this.async();

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

	});

	grunt.registerTask('src', "Check & store CHROMIUM_SRC env var", function() {
		if (!chromiumSrc) {
			console.log('CHROMIUM_SRC env var has not been set');
			var done = this.async();
			var msg = {
				properties: {
					path: {
						message: 'Path to telemetry src file',
						required: true
					}
				}
			};
			prompt.start();
			prompt.get(msg, function (err, result) {

				if (!result.path.match(/(\/src\/{0,1})$/)) {
					grunt.log.error('CHROMIUM_SRC path not valid.');
					grunt.fail.warn('Path Must end in /src check again.');
					done();
				} else {
					chromiumSrc = result.path;
					grunt.task.run('default');
					done();
				}
			});
		} else {
			grunt.log.writeln("CHROMIUM_SRC points to " + chromiumSrc.cyan);
		}
	});

};