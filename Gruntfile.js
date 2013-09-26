var chromiumSrc = process.env.CHROMIUM_SRC
	, prompt = require('prompt')
	, path = require('path')
	;


module.exports = function(grunt) {

	if (chromiumSrc == '') {
		grunt.log.warn('Make sure process.env.CHROMIUM_SRC is set up');
		grunt.fail.warn('Export the path to the env');
	}
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			telemetry: {},
			options: {
				force: true
			}
		},
		clean: {
			telemetry: {
				src : [
					'perf/page_sets/*',
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
                files: [],
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
			"parentDir": [
				"test/button"
			],
			"testPages": [
				"*.html"
			],
			"css": [
				"css/topcoat-mobile-dark.min.css"
			],
			"instances": 400,
			"minified": true,
			"repeat": 1
		},
		simplemocha: {
			run_task: {
				src: ['test/test.js']
			},
			page_sets: {
				src: ['test/page_sets.test.js']
			},
			cleanz: {
				src: ['test/clean.test.js']
			}
		},
	});

	grunt.loadTasks('tasks/');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('default', ['cleanz','assemble-build', 'telemetry']);
	grunt.registerTask('telemetry', ['run:telemetry:snapshot:True']);
	grunt.registerTask('test', ['simplemocha:run_task', 'simplemocha:page_sets', 'simplemocha:cleanz']);

};