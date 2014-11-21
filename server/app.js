var express = require("express");
var path = require("path");
var morgan = require('morgan');
var bodyParser = require('body-parser');

var port = process.env.PORT || 9000;

var rootPath = path.normalize(__dirname + '/..');
var appPath = path.join(rootPath, 'build');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


if (app.get("env") === "development") {
    app.use(morgan('dev'));
    app.use(require('connect-livereload')());
}


app.use(express.static(appPath));
app.set("appPath", appPath);

// setup routes
require("./routes")(app);

app.listen(port, function() {
    console.log('Listening on port ' +  port + " in mode: " + process.env.NODE_ENV);
});

// Expose app
module.exports = app;