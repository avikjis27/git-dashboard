import {fetchAccessToken} from '../data-access/access-token'
import {getOpenPRCount} from '../graph-ql/git-open-pr'
import {getOpenIssueCount} from '../graph-ql/git-open-issue'

export async function aggregator(reqDomain, reqOwner, repo, reportNames ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	if(reportNames['OPEN_PR']){
		if(accessResp.token){
			const count = await getOpenPRCount(accessResp.token, reqOwner, repo);
			output['OPEN_PR'] = count;
		}else{
			console.warn("Access token not set for the domain "+ reqDomain);
		}
	}
	if(reportNames['OPEN_ISSUES']){
		if(accessResp.token){
			const count = await getOpenIssueCount(accessResp.token, reqOwner, repo);
			output['OPEN_ISSUES'] = count;
		}else{
			console.warn("Access token not set for the domain "+ reqDomain);
		}
	}
	return output;
}


