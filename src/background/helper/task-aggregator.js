import {fetchAccessToken} from '../data-access/access-token'
import {fetchRepos} from '../data-access/git-repository'
import {cacheTasks, fetchTasks} from '../data-access/git-tasks'
import {yourTasks} from '../graph-ql/git-your-tasks'
import moment from 'moment';

export async function taskAggregator(noCache=false) {
	const output = {openPRRequiredReview:[], prNeedToMerge:[],changeRequested:[]};	
	const cachedTasks = await fetchTasks();
	if(cachedTasks && !noCache){
		return cachedTasks.tasks
	}
	console.log("cachedTasks", cachedTasks);
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
			const apiEndPoint = "https://"+ repodetails.domain + "/" + "api";
			console.log("apiEndPoint", apiEndPoint)
			if(!accessResp.token){
				console.warn("Access token not set for the domain "+ repodetails.domain);
				return;
			}
			const tasks = await yourTasks(accessResp.token, repodetails.owner, repodetails.repo, apiEndPoint)
			output['openPRRequiredReview'] = output['openPRRequiredReview'].concat(tasks['openPRRequiredReview'])
			output['prNeedToMerge'] = output['prNeedToMerge'].concat(tasks['prNeedToMerge'])
			output['changeRequested'] = output['changeRequested'].concat(tasks['changeRequested'])
		}
	}
	output['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a');
	cacheTasks(output);
	console.log(taskAggregator, output)
	return output;
}





