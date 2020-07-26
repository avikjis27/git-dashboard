import { getOpenPRCount } from './git-open-pr.js'

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	console.log("Got the message: "+ msg);
	if (msg.type ===  'popupInit'){
		getOpenPRCount().then (count => {
			response(count)
		});
	}
	return true;
});

chrome.commands.onCommand.addListener(function(command) {
  switch(command){
    case "follow-repo" :
      follow_repo();
			break;
		case "unfollow-repo" :
      unfollow_repo();
    	break;
  }
});

function parse_url(url){
	let parser = document.createElement('a');
	parser.href = url;
	let host = parser.host;
	let path = parser.pathname;
	let segments = path.split('/').filter(Boolean);
	let repo = segments.length > 1 ? segments[1] : ""
	let owner = segments[0]
	return {
		domain: host,
		owner: owner,
		repo: repo
	}
}

function follow_repo(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log(parse_url(tabs[0].url));
  });
}

function unfollow_repo(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log(parse_url(tabs[0].url));
  });
}

