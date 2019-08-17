var fs = require('fs');
var btoa = require('btoa');
var meta = JSON.parse(fs.readFileSync('./meta-data.json'));
var filename = './controllers/results.json';
var open = true;
node_ssh = require('node-ssh');
ssh = new node_ssh()

// Display list of all Authors
exports.login = (req, res, next) => {
	if(open) {
	    var content = JSON.parse(fs.readFileSync(filename));
	    res.render('layout', { body: 'login_form', error: null, count: content._count});		
	    //res.render('layout', { body: 'poll_form', data: meta, btoa: btoa});
	}
	else {
		var content = JSON.parse(fs.readFileSync(filename));
		var count = content._count;
		delete content._count;
		var maxer = {};
		for (var key in content) {
			var max = 0;
			for(var can in content[key]) {
				if(content[key][can] > max) {
					max = content[key][can];
					maxer[key] = can;
				}
			}
		}
		console.log(maxer);
		res.render('layout', { body: 'result', data: content, count: count, elected: maxer });
		//open = true;
	}
};

exports.checklogin = (req, res, next) => {
	switch (req.body.password) {
		case process.env.POLL_PWD || 'poll123':
			res.render('layout', { body: 'poll_form', data: meta, btoa: btoa});
			break;
		case process.env.RESULT_PWD || 'result000':
			open = false;
			res.redirect('/');
			break;
		case process.env.RESET_PWD || 'reset999':
			res.render('layout', { body: 'reset' });
			break;
		default:
			var content = JSON.parse(fs.readFileSync(filename));
    		res.render('layout', { body: 'login_form', error: 'Incorrect Password', count: content._count});
	}
};

exports.poll = (req, res, next) => {
	var content = JSON.parse(fs.readFileSync(filename));
	console.log(req.body);
	for(var i=0; i<meta.length; i++) {
		console.log(req.body[btoa(meta[i].post)]);
		content[meta[i].post][meta[i].candidates[req.body[btoa(meta[i].post)]].name]++;
	}
	content._count++;

	fs.writeFileSync(filename, JSON.stringify(content, 0, 4));
	res.redirect('/');
};

exports.reset = (req, res, next) => {
	var content = {};
	for(var i=0; i<meta.length; i++)
	{
		var pos = {};
		for(var j=0; j<meta[i].candidates.length; j++)
		{
			pos[meta[i].candidates[j].name] = 0;
		}
		content[meta[i].post] = pos;
	}
	content['_count'] = 0;
	fs.writeFileSync(filename, JSON.stringify(content, 0, 4));
	res.redirect('/');
}

exports.result = (req, res, next) => {
}

exports.ssh = (req, res, next) => {
	ssh.connect({
		host: 'webhome.cc.iitk.ac.in',
		username: req.body.user,
		password: req.body.pass
	  })
	  .then(function() {;
		ssh.dispose();
		res.sendStatus(200);
	  })
	  .catch(function(error) {
		ssh.dispose();
		console.log(error);
		if(error.code)
			res.sendStatus(500);
		else
			res.sendStatus(401);
	});
}
