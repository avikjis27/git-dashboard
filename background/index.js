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

