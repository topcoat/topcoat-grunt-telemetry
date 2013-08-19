var fs   = require("fs"),
    jade = require("jade"),
    path = require("path");

module.exports = function (grunt) {

    var TELEMETRY_DIR = 'perf/page_sets/',
        MASTER_JADE   = 'src/topcoat_telemetry.jade';

    grunt.registerTask('generate', 'Generates performance test', function (platform, theme) {

        var perfJades = findAllPerfJadeFileInSrc();

        var targetPlatform = platform || 'mobile',
            targetTheme    = theme    || 'light';

        var jadeCompileData = {};

        grunt.util._.forEach(perfJades, function (jadePath) {

            var jadeFileName = path.basename(jadePath).split('.')[0];

            prepareJadeCompileData(jadeCompileData, jadePath, jadeFileName, targetPlatform, targetTheme);

            createTelemetryJSON(jadeFileName);
        });
        batchCompileJade(jadeCompileData);
    });

    var findAllPerfJadeFileInSrc = function () {

        var jades = grunt.file.expand('node_modules/topcoat-*/test/perf/topcoat_*.jade');

        if (jades.length === 0){
            throw new Error("ERROR: No jade file is found in src/../test/perf/");
        }

        return jades;
    };

    var prepareJadeCompileData = function (jadeCompileData, jadePath,
                                           caseName, platform, theme) {

        var jadeContent = fs.readFileSync(jadePath, "utf8"),
            getHtml = jade.compile(jadeContent);

        var _path = jadePath.split('/')
            , cssFile = path.join(_path[1], 'css', _path[1] + '-' + platform + '-' + theme + '.min.css')
            ;

        grunt.file.exists('node_modules/' + cssFile) ? cssFile = cssFile
            : cssFile = path.join(_path[1], 'css', _path[1] + '.min.css');
        jadeCompileData[caseName] = {
            options: {
                data: {
                    platform: platform,
                    theme: theme,
                    css: cssFile,
                    name: caseName,
                    componentHTML: getHtml()
                }
            },
            src:  MASTER_JADE,
            dest: TELEMETRY_DIR + "topcoat/" + caseName + ".test.html"
        };
    };

    var createTelemetryJSON = function (caseName) {

        var jsonContent = {
            "description": "Test",
            "archive_data_file": "../data/topcoat_buttons.json",
            "pages": [
                {
                    "url": "file:///topcoat/" + caseName + ".test.html",
                    "smoothness": {
                        "action": "scroll"
                    }
                }
            ]
        };

        var jsonFilePATH = TELEMETRY_DIR + caseName + '.test.json';

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
