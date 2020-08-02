import {fetchRepos} from './handler-repository'
import {fetchQuery} from './handler-git-query'
import {fetchAccessToken} from './handler-access-token'
import {getOpenPRCount} from './git-open-pr'

export async function aggregator(reqDomain, reqOwner ) {
	console.log("aggregator:param", reqOwner, reqDomain);
	let resp = await fetchRepos();
	const repos = [];
	const accessResp = await fetchAccessToken(reqDomain);
	console.log("aggregator:token", accessResp);
	resp.rows.forEach(row => {
		const domain = row.doc.details.domain;
		const owner = row.doc.details.owner;
		const repo = row.doc.details.repo;
		if (domain === reqDomain && owner === reqOwner) {
			repos.push(repo);
		}
		
	})
	console.log("aggregator:repo", repos);
	for (const repo of repos){
		const key = reqDomain+"/"+reqOwner+"/"+repo;
		const resp = fetchQuery(key);
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo);
		console.log("aggregator:Got count", count);
	}
}


