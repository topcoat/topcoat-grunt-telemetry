## topcoat-grunt-telemetry

## Configurations

````
"test": {
	 // a different task for each testing framework
    "telemetry": {
      "files": [
        // pattern after which to match the test files
        // must be in a folder under node_modules
        // will be fixed
        "node_modules/topcoat-*/index.html"
      ],
      "css": [
        // see below for explanation
      	"/../css/*mobile-light.min.css",
        "/../css/*.min.css"
      ]
      // how many time should the component 
      // be repeated in the page
      "instances": 50,
      // minified test file or not
      "minified": true,
      // how many times should each test run
      "repeat": 10
    }
  }
  ````

####  CSS path

The parameter must be relative to the index.html page. 
Take for example this hierarchy

````
root
	├── css/style.css
	├── test/button.html
````

The parameter must be `/../css/*.css`

An array of parameters means that if the first does not match it will try the next.

#### Layout

````
<!doctype html>
<html>
<head>
  <title></title>
  <link rel="stylesheet" href="{{ style }}">
</head>
<body>
  {{#repeat instances}} // repeats the html
    {{#extract}} // extracts the body
      {{> body }}
    {{/extract}}
  {{/repeat}}
</body>
</html>
````

#### One time only step
* Replace loading.py & smoothness.py from here CHROMIUM_SRC/tools/perf/measurements/ with [these](https://github.com/topcoat/topcoat-grunt-telemetry/tree/master/src/tools/perf/measurements) 
* Could skip this step though, all it does is add the user agent to the test results
* screencast https://vimeo.com/72665159
