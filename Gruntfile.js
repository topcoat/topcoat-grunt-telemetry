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
					{ expand: true, src: ['perf/**'], dest: path.join(chromiumSrc, '/tools/') }
				]
			},
			options: {
				force: true
			}
		},
		clean: {
			telemetry: {
				src : [
					'perf/page_sets/*', chromiumSrc + '/tools/perf/page_sets/topcoat',
					chromiumSrc + '/tools/perf/page_sets/topcoat_*.json',
					'/tmp/loading*',
					'/tmp/smoothness*'
				],
				options: {
					force: true
				}
			}
		},
		htmlmin: {
            telemetry: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: ['perf/page_sets/topcoat/*.html'],
                    dest: '.',
                    ext: '.test.html',
                }],
            },
        },
        assemble: {
			options: {
				prettify: {
					indent: 2
				},
				flatten: true,
				minified: true,
				layoutdir: 'templates',
				layout: 'layout.hbs',
				helpers: 'templates/helpers/*.js',
			}
		},
		telemetry: {
			files: [
				"node_modules/topcoat-*/test/perf/*.html"
				],
			css: [
				"/../../../css/*.css",
				"/../../../css/*.css"
			],
			instances: 10,
			minified: false,
			repeat: 1
		}
	});

	grunt.loadTasks('tasks/');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['src', 'assemble-build', 'copy']);
	grunt.registerTask('telemetry', ['run:telemetry:snapshot']);

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