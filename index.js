var mandrill = require("mandrill-api/mandrill");
var mandrillClient = new mandrill.Mandrill('ujh-0wblFBVbVSxFSYVsfg');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require("through2");
var fs = require("fs");
var path = require("path");

// constants
const PLUGIN_NAME = 'gulp-mandrill';

var exports = {};
module.exports = exports;

function renderTemplate(template, cb, error) {
    mandrillClient.templates.render({
        "template_name": template.name,
        "template_content": [{
            "name":"editable",
            "content" : template.content
        }]
    }, function(result){
        cb(result.html);
    }, function(e) {
        error(e);
    });
}

exports.render = function() {
    var stream = through.obj(function(file, enc, cb){
        var self = this;
        if (file.isBuffer()) {
            var template = {
                name: path.basename(file.path, '.html'),
                content: file.contents.toString('utf-8')
            };
            renderTemplate(template, function(html){
                file.contents = new Buffer(html);
                self.push(file);
                cb();
            }, function(){
                self.emit('error', new PluginError(PLUGIN_NAME, 'Error with rendering'));
                cb();
            });
        }

        if (file.isStream()) {
            self.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            return cb();
        }
    });

    return stream;
};