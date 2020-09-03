import {fetchAccessToken} from '../data-access/access-token'
import {fetchRepos} from '../data-access/git-repository'
import {cacheTasks, fetchTasks} from '../data-access/git-tasks'
import {fetchIgnoredPRs} from '../data-access/ignored-pr'
import {yourTasks} from '../graph-ql/git-your-tasks'
import {getEP} from './get-endpoint'
import moment from 'moment';

function removedIgnoredPRs(allPrs, ignoredPRs) {
	if(ignoredPRs.length>0){
		return allPrs.filter(pr => !ignoredPRs.some(el => el.id === pr.url))
	}
	return allPrs;
}

export async function taskAggregator(noCache=false) {
	const output = {hasTask: false, openPRRequiredReview:[], prNeedToMerge:[],changeRequested:[]};	
	const cachedTasks = await fetchTasks();
	if(cachedTasks && !noCache){
		return cachedTasks.tasks
	}
	const followedRepos = await fetchRepos();
	if(!followedRepos){
		console.warn("No repositories found");
		return;
	}
	for (let index = 0; index < followedRepos.rows.length; index++){
		const row = followedRepos.rows[index]
		const repodetails = row.doc.details
		if(repodetails.favourite){
			const accessResp = await fetchAccessToken(repodetails.domain);
			const apiEndPoint = getEP(repodetails.domain);
			if(!accessResp.token){
				console.warn("Access token not set for the domain "+ repodetails.domain);
				return;
			}
			const tasks = await yourTasks(accessResp.token, repodetails.owner, repodetails.repo, apiEndPoint)
			const ignoredPRs = await (await fetchIgnoredPRs()).rows
			output['openPRRequiredReview'] = removedIgnoredPRs(output['openPRRequiredReview'].concat(tasks['openPRRequiredReview']), ignoredPRs)
			output['prNeedToMerge'] = removedIgnoredPRs(output['prNeedToMerge'].concat(tasks['prNeedToMerge']), ignoredPRs)
			output['changeRequested'] = removedIgnoredPRs(output['changeRequested'].concat(tasks['changeRequested']), ignoredPRs)

			

		}
	}
	output['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a');
	if(output['openPRRequiredReview'].length > 0 || output['prNeedToMerge'].length > 0 || output['changeRequested'].length > 0){
		output.hasTask = true;
	}
	cacheTasks(output);
	return output;
}





