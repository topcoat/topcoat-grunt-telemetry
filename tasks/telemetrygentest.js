var fs   = require("fs"),
    jade = require("jade"),
    path = require("path");

/*
    grunt generate task
    read the configuration from package.json
    scans through the array of files provided for .jade files
    uses the template .jade and the files found to build test pages

*/
module.exports = function (grunt) {

    var options = grunt.file.readJSON('package.json').test;

    grunt.registerTask('generate', 'Generates test pages', function () {
        
        if (!Object.keys(options).length) {
            grunt.log.warn('ERROR: No options found in package.json');
        }
        
        var jadeCompileData = {};

        grunt.util._.forEach(findAllPerfJadeFileInSrc(), function (jadePath) {

            var jadeFileName = path.basename(jadePath).split('.')[0];
            prepareJadeCompileData(jadeCompileData, jadePath, jadeFileName);
            createTelemetryJSON(jadeFileName);

        });

        batchCompileJade(jadeCompileData);
    });

    var findAllPerfJadeFileInSrc = function () {

        var jades = grunt.file.expand(options.telemetry.files);

        if (jades.length === 0){
            throw new Error('ERROR: No jade file is found in ' + testsPagesPath);
        }

        return jades;
    };

    var prepareJadeCompileData = function (jadeCompileData, jadePath, caseName) {

        var jadeContent = grunt.file.read(jadePath)
            , getHtml = jade.compile(jadeContent)
            ;

        var _path = jadePath.split('/')
            , cssFile = path.join(_path[1], 'css', _path[1] + '.min.css')
            ;

        jadeCompileData[caseName] = {
            options: {
                data: {
                    css: cssFile,
                    name: caseName,
                    componentHTML: getHtml(),
                    repeats: options.telemetry.repeats
                },
                pretty: !options.telemetry.minified
            },
            src:  options.telemetry.template,
            dest: "perf/page_sets/" + "topcoat/" + caseName + ".test.html"
        };
    };

    var createTelemetryJSON = function (caseName) {

        var jsonContent = {
            "description": caseName,
            "archive_data_file": "../data/" + caseName + ".json",
            "pages": [
                {
                    "url": "file:///topcoat/" + caseName + ".test.html",
                    "smoothness": {
                        "action": "scroll"
                    }
                }
            ]
        };

        var jsonFilePATH = "perf/page_sets/" + caseName + '.test.json';

        fs.writeFileSync(
            jsonFilePATH,
            JSON.stringify(jsonContent, null, 4),
            'utf8');
    };

    var batchCompileJade = function(data){
        grunt.config('jade', data);
        grunt.task.run('jade');
    };
};
