import {fetchQuery} from './handler-git-query'
import {fetchAccessToken} from './handler-access-token'
import {getOpenPRCount} from './git-open-pr'

export async function aggregator(reqDomain, reqOwner, repo ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	// resp.rows.forEach(row => {
	// 	const domain = row.doc.details.domain;
	// 	const owner = row.doc.details.owner;
	// 	const repo = row.doc.details.repo;
	// 	if (domain === reqDomain && owner === reqOwner) {
	// 		repos.push(repo);
	// 	}
		
	// })
	// console.log("aggregator:repo", repos);
	// for (const repo of repos){
	const key = reqDomain+"/"+reqOwner+"/"+repo;
	const resp = await fetchQuery(key);
	console.log("aggregator:",resp)
	if(resp.query['OPEN_PR']){
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo);
		output['OPEN_PR'] = count;
	}
	//}
	return output;
}


