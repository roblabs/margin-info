'use strict';

module.exports.margininfo = (event, context, callback) => {

  var fs = require("fs");  // File System
  var vm = require("vm");  // V8 Virtual Machine

  var svg;
  var method;
  var args;

  if (event.multiValueQueryStringParameters) { // GET requests with query params
    // values are stored in an array so we need to fetch the first element in the array
    method = event.multiValueQueryStringParameters.method[0];
    args = event.multiValueQueryStringParameters.args;
  } else if (event.body) { // POST requests
    var body = JSON.parse(event.body);
    method = body.method;
    args = body.args;
  } else { // inovke from the lambda console
    method = event.method;
    args = event.args;
  }

  switch (method) {
  case "scalebar":
      var context = fs.readFileSync("./scalebar.js")
      vm.runInThisContext(context)

      /* global scalebar */
      svg = scalebar(args[0],
              args[1],
              args[2],
              args[3]);
      break;
  case "slope":
      var context = fs.readFileSync("./slopeguide.js")
      vm.runInThisContext(context)

      /* global slopeguide */
      svg = slopeguide(args[0],
              args[1]);
      break;
  case "grid":
      var context = fs.readFileSync("./griddeclinationdiagram.js")
      vm.runInThisContext(context)

      /* global griddeclinationdiagram */
      svg = griddeclinationdiagram(parseFloat(args[0]),
              parseFloat(args[1]),
              args[2],
              args[3],
              args[4]);
      break;
  default:
      console.log('You entered these parameters: ', method, args);
      // console.log(usage);
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      "Content-Type": 'image/svg+xml'
    },
    body: svg
  };


  callback(null, response);
};
