var   path = require('path')
	, write
    , expand
	;

// creates json file for Telemetry
// points to the perf html page
// defines all the interactions with the page
function createTelemetryJSON (filename, min) {

	var name = path.basename(filename)
	  , dirs = filename.split(path.sep)
      , jsonFilePATH = "perf/page_sets/" + dirs[dirs.length - 2] + name + '.json'
      ;

	var jsonContent = {
		"description": name,
		"archive_data_file": "../data/" + name + ".json",
		"pages": [
			{
				"url": "file:///topcoat/" + filename,
				"smoothness": {
					"action": "scroll"
				}
			}
		]
	};

	write(jsonFilePATH,
		JSON.stringify(jsonContent, null, 4),
		'utf8');

}

// Expands pattern that points to the CSS folder
// Get the very first css file it finds
// Not ideal. Up to the user to provide an accurate pattern
function getCSSFile (dir, cssFiles) {
	return cssFiles.map(function (f) {
		return expand(path.join(dir, f))[0];
	}).filter(function (x) {
		return x;
	})[0];
}

module.exports = function (grunt) {

	write = grunt.file.write;
	expand = grunt.file.expand;

	grunt.registerTask('assemble-build', 'Generates test pages', function () {

		if (process.env.CHROMIUM_SRC == null) {
			grunt.task.run('src');
		} else {

			var   pkgOptions  = grunt.config('telemetry')
				, copyOpt     = grunt.config('copy')
				, minOpt 	  = grunt.config('htmlmin')
				, parentDir   = grunt.file.expand(pkgOptions.parentDir)
				, chromiumSrc = process.env.CHROMIUM_SRC
				, assembleConfigs = grunt.config('assemble')
				;

			copyOpt.telemetry.files = [{
				expand: true,
				src: ['perf/**'],
				dest: path.join(chromiumSrc, '/tools/') 
			}]

	        // Pass over the configurations to assemble
	        // instances tells assemble how many times to repeat a component
			assembleConfigs.options.instances = pkgOptions.instances;
			
	        // Checks all the parent dirs for perf file matches
			parentDir.forEach(function (dir) {
				pkgOptions.testPages.forEach(function (pattern) {

					var matches = grunt.file.expand(path.join(dir, pattern));

	                // If found parent dir will be copied to telemetry
					if (matches.length) {

						copyOpt.telemetry.files.push({
							expand: true,
							src: dir + '/**',
							dest: path.join(chromiumSrc, '/tools/perf/page_sets/topcoat/')
						});

						matches.forEach(function (f) {

							var filename = path.join(path.dirname(f),path.basename(f, '.html') + '.perf.html');
							console.log(filename);
	                        // Generate json file that points to perf html page
							createTelemetryJSON(path.join(dir, path.basename(filename)), pkgOptions.minified);
	                        
	                        // tell assemble to create the perf page
							assembleConfigs[path.basename(f)] = { files: {} };
							assembleConfigs[path.basename(f)].files[filename] = f;
							//console.log(assembleConfigs);

	                        // find the relative path to the CSS for the perf page
							var css = getCSSFile(dir, pkgOptions.css);
							assembleConfigs[path.basename(f)].options = {
								style: path.relative(dir, css)
							};
						});

					}
				});
			});

			grunt.config('copy', copyOpt);

			grunt.config('assemble', assembleConfigs);

			grunt.task.run('assemble');
			grunt.task.run('copy');
			
		}


	});

};