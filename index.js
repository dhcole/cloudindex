var _ = require('underscore');
var express = require('express');
var app = express();
var exec = require('child_process').exec,
    child;

// New webhook post
app.post('/hooks/cloudindex', function(req, res){
    var data = parseHook(req.body);
    // Git clone
    git_clone(data.url, parseFiles);
    // Read each file in data.actions
    // If file `published = false`, set action to delete
    // Set up SDF template
    // Parse yml, add to SDF template
    // Figure out permalink
    // Add content add SDF field
    // run `cf-generate-sdf` to batch and push index files

    res.send(200);
});

// Add index all mode, move serve to option

// Start server
app.listen(8080);
console.log('Listening on port 3000');

function parseHook(data) {
    var output = {
        url: 'git@github.com:' + data.repository.owner.name + '/' + data.repository.name + '.git',
        time: data.commits[data.commits.length - 1].timestamp
    };
    output.actions = _(data.commits)
        .chain()
        // Combine all file actions into one list
        .map(function(commit) {
            var output = [];
            output.push(_(commit.added).map(function(file) { return { 'add': file }; }));
            output.push(_(commit.removed).map(function(file) { return { 'add': file }; }));
            output.push(_(commit.modified).map(function(file) { return { 'delete': file }; }));
            return _(output).flatten();
        })
        .flatten()
        // Group list by unique files
        .groupBy(function(file) {
            // Only include files in a _posts directory
            if (file.indexOf('_posts/') === -1) return;
            return file;
        })
        .compact()
        // List most recent action for each file
        .map(function (actions, file) {
            return {}[_(actions[actions.length - 1]).keys()[0]] = file;
        })
        .value();
    return output;
}

function git_clone(url, cb) {
    child = exec('git clone ' + url + ' ~/cloudindex/tmp/', function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}
