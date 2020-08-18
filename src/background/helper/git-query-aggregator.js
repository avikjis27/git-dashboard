import {fetchAccessToken} from '../data-access/access-token'
import {getOpenPRCount} from '../graph-ql/git-open-pr'
import {getOpenIssueCount} from '../graph-ql/git-open-issue'
import {yourOpenPRs} from '../graph-ql/git-your-pr'

export async function aggregator(reqDomain, reqOwner, repo, reportNames ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	if(!accessResp.token){
		console.warn("Access token not set for the domain "+ reqDomain);
		return;
	}
	if(reportNames['OPEN_PR']){
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo);
		output['OPEN_PR'] = count;
	}
	if(reportNames['OPEN_ISSUES']){
		const count = await getOpenIssueCount(accessResp.token, reqOwner, repo);
		output['OPEN_ISSUES'] = count;
	}
	if(reportNames['OWN_PR_STATUS']){
		const result = await yourOpenPRs(accessResp.token, reqOwner, repo);
		output['OWN_PR_STATUS'] = result;
	}
	return output;
}

export async function aggregator(reqDomain, reqOwner, repo, reportNames ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	if(!accessResp.token){
		console.warn("Access token not set for the domain "+ reqDomain);
		return;
	}
	if(reportNames['OPEN_PR']){
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo);
		output['OPEN_PR'] = count;
	}
	if(reportNames['OPEN_ISSUES']){
		const count = await getOpenIssueCount(accessResp.token, reqOwner, repo);
		output['OPEN_ISSUES'] = count;
	}
	if(reportNames['OWN_PR_STATUS']){
		const result = await yourOpenPRs(accessResp.token, reqOwner, repo);
		output['OWN_PR_STATUS'] = result;
	}
	return output;
}




