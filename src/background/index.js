import {followRepo, unfollowRepo, fetchRepos, toggleFavouriteRepo} from './data-access/git-repository'
import {fetchAccessTokens, addOrUpdateAccessToken} from './data-access/access-token'
import {fetchAPIEndPoints, addOrUpdateAPIEndPoint} from './data-access/api-endpoint'
import {fetchQuery, addNamedQuery, deleteNamedQuery} from './data-access/named-report'
import {aggregator} from './helper/git-query-aggregator'
import {taskAggregator} from './helper/task-aggregator'

chrome.runtime.onInstalled.addListener(() => {
	console.log('onInstalled...');
	chrome.alarms.create("fetchTasks" ,{delayInMinutes: 1, periodInMinutes: 1	})

});

chrome.alarms.onAlarm.addListener((alarm) => {
	switch(alarm.name) {
		case 'fetchTasks':
			console.log("fetchTasks event fired")
			taskAggregator(true);
			break;
	}
})

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	switch(msg.type) {
		case 'popupInit':
			taskAggregator().then ((tasks) => {
				response(tasks);
			})
			break;
		case 'detailsInit':
		case 'optionInit':
			initOptionPage().then (data => {
				response(data);
			})
			break;
		case 'acessTokenUpdated':
			addOrUpdateAccessToken( msg.domain, msg.token).then (() => {
				response();
			})
			break;
		case 'apiEPUpdated':
			addOrUpdateAPIEndPoint( msg.domain, msg.ep).then (() => {
				response();
			})
		case 'fetchAvailableReports':
			fetchQuery( msg.reportkey ).then ((data) => {
				response(data);
			})
			break;
		case 'saveQueries':
			addNamedQuery( msg.key, msg.object).then (() => {
				response();
			})
			break;
		case 'queryGitRepo':
			aggregator( msg.domain, msg.owner, msg.repo, msg.reportNames).then ((data) => {
				response(data);
			})
			break;
		case 'toggleFavourite':
			toggleFavouriteRepo( msg.repo ).then (() => {
				response();
			})
			break;
		default:
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

async function initOptionPage(){
	let repos = await fetchRepos();
	let tokens = await fetchAccessTokens();
	let eps = await fetchAPIEndPoints();
	const tokenData = {};
	const epData = {};
	tokens.rows.forEach(row => {
		tokenData[row.id] = row.doc.token;
	});
	eps.rows.forEach(row => {
		epData[row.id] = row.doc.endPoint;
	});
	const data = [];
	repos.rows.forEach(row => {
		const domain = row.doc.details.domain;
		const owner = row.doc.details.owner;
		const repo = row.doc.details.repo;
		const isfavourite = row.doc.details.favourite;
		data.push([domain, owner, repo, isfavourite]);
	})
	const response = {
		"repos": organizeData(data),
		"tokens": tokenData,
		"apiEndpoints": epData,
		"queries": {}
	};
	return response;
}

function organizeData(data){
	const jsonData = {};
	data.forEach(item => {
		if (item[0] in jsonData){
			if (item[1] in jsonData[item[0]]){
				jsonData[item[0]][item[1]].push({name:item[2], favourite:item[3]});
			}else{
				jsonData[item[0]][item[1]] = [{name:item[2], favourite:item[3]}];
			}
		}else{
			jsonData[item[0]] = {};
			jsonData[item[0]][item[1]] = [{name:item[2], favourite:item[3]}];
		}
	})
	return jsonData;
}

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
	};
}

function follow_repo(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		const parsedURL = parse_url(tabs[0].url)
		followRepo(parsedURL);
		addNamedQuery( parsedURL.domain+"/"+parsedURL.owner+"/"+parsedURL.repo, {
			OPEN_PR: true,
			OPEN_ISSUES: false,
			OWN_PR_STATUS: false,
			AGED_PRS: false,
		})
  });
}

function unfollow_repo(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		const parsedURL = parse_url(tabs[0].url)
		unfollowRepo(parsedURL);
		deleteNamedQuery( parsedURL.domain+"/"+parsedURL.owner+"/"+parsedURL.repo );
  });
}

