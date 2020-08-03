import { getOpenPRCount } from './git-open-pr.js'
import {followRepo, unfollowRepo, fetchRepos} from './handler-repository'
import {fetchAccessToken, fetchAccessTokens, addOrUpdateAccessToken} from './handler-access-token'
import {fetchQuery, addNamedQuery, deleteNamedQuery} from './handler-git-query'
import {aggregator} from './git-query-aggregator'

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	switch(msg.type) {
		case 'popupInit':
			getOpenPRCount().then (count => {
				response(count)
			});
			break;
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
		case 'fetchAvailableReports':
			fetchQuery( msg.key ).then ((data) => {
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
	const tokenData = {};
	tokens.rows.forEach(row => {
		tokenData[row.id] = row.doc.token;
	});
	const data = [];
	repos.rows.forEach(row => {
		const domain = row.doc.details.domain;
		const owner = row.doc.details.owner;
		const repo = row.doc.details.repo;
		data.push([domain, owner, repo]);
	})
	const response = {
		"repos": organizeData(data),
		"tokens": tokenData,
		"queries": {}
	};
	return response;
}

function organizeData(data){
	const jsonData = {};
	data.forEach(item => {
		if (item[0] in jsonData){
			if (item[1] in jsonData[item[0]]){
				jsonData[item[0]][item[1]].push(item[2]);
			}else{
				jsonData[item[0]][item[1]] = [item[2]];
			}
		}else{
			jsonData[item[0]] = {};
			jsonData[item[0]][item[1]] = [item[2]];
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
	}
}

function follow_repo(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		const parsedURL = parse_url(tabs[0].url)
		followRepo(parsedURL);
		addNamedQuery( parsedURL.domain+"/"+parsedURL.owner+"/"+parsedURL.repo, {
			OPEN_PR: true,
			OPEN_ISSUES: false,
			OWN_PR_STATUS: false
		})
  });
}

function unfollow_repo(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		const parsedURL = parse_url(tabs[0].url)
		unfollowRepo(parsedURL);
		deleteNamedQuery( parsedURL.domain+"/"+parsedURL.owner+"/"+parsedURL.repo);
  });
}

