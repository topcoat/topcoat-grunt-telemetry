/*global module:false*/
module.exports = function(grunt) {


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            release: ['css']
        },

        stylus: {
            mobilelight: {
                options: {
                    paths: ['node_modules/topcoat-button-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-mobile-light'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-button.styl',
                    dest: 'css/topcoat-button-mobile-light.css'
                }]
            },

            mobiledark: {
                options: {
                    paths: ['node_modules/topcoat-button-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-mobile-dark'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-button.styl',
                    dest: 'css/topcoat-button-mobile-dark.css'
                }]
            },

            desktoplight: {
                options: {
                    paths: ['node_modules/topcoat-button-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-desktop-light'],
                    compress: false
                },
                files: [{
                    src: 'src/topcoat-button.styl',
                    dest: 'css/topcoat-button-desktop-light.css'
                }]
            },

            desktopdark: {
                options: {
                    paths: ['node_modules/topcoat-button-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-desktop-dark'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-button.styl',
                    dest: 'css/topcoat-button-desktop-dark.css'
                }]
            }
        },

        topdoc: {
            usageguides: {
                options: {
                    source: 'css',
                    destination: './',
                    template: 'https://github.com/topcoat/usage-guide-theme',
                    templateData: '<%= pkg.topdoc.templateData %>'
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'css',
                src: ['*.css', '!*.min.css'],
                dest: 'css',
                ext: '.min.css'
            }
        },

        copy: {
            release: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'node_modules/topcoat-theme/img/hamburger_dark.svg',
                    dest: 'img'
                }]
            }
        },

        jade: {
            compile: {
                expand: true,
                cwd: 'test/perf',
                src: ['*.jade'],
                dest: 'test/perf/',
                ext: '.test.html'
            }
        },

        simplemocha: {
            all: {
                src: ['test/*.test.js']
            }
        },

        watch: {
            files: 'src/**/*.styl',
            tasks: ['build', 'test']
        }
    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-topdoc');

    // Default task.
    grunt.registerTask('default', ['clean', 'build', 'test', 'release']);
    grunt.registerTask('build', ['stylus', 'jade']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('release', ['cssmin', 'copy', 'topdoc']);

};
