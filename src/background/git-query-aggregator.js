import {fetchQuery} from './handler-git-query'
import {fetchAccessToken} from './handler-access-token'
import {getOpenPRCount} from './git-open-pr'

export async function aggregator(reqDomain, reqOwner, repo, reportNames ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	if(reportNames['OPEN_PR']){
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo);
		output['OPEN_PR'] = count;
	}
	return output;
}


