import {fetchAccessToken} from '../data-access/access-token'
import {getOpenPRCount} from '../graph-ql/git-open-pr'
import {getOpenIssueCount} from '../graph-ql/git-open-issue'
import {yourOpenPRs} from '../graph-ql/git-your-pr'
import {agedPRCount} from '../graph-ql/git-aged-pr'
import {yourContribution} from '../graph-ql/git-your-contribution'
import {getEP} from './get-endpoint'

export async function aggregator(reqDomain, reqOwner, repo, reportNames ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	const apiEndPoint = getEP(reqDomain);
	if(!accessResp.token){
		console.warn("Access token not set for the domain "+ reqDomain);
		return;
	}
	if(reportNames['OPEN_PR']){
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo, apiEndPoint);
		output['OPEN_PR'] = count;
	}
	if(reportNames['OPEN_ISSUES']){
		const count = await getOpenIssueCount(accessResp.token, reqOwner, repo, apiEndPoint);
		output['OPEN_ISSUES'] = count;
	}
	if(reportNames['OWN_PR_STATUS']){
		const result = await yourOpenPRs(accessResp.token, reqOwner, repo, apiEndPoint);
		output['OWN_PR_STATUS'] = result;
	}
	if(reportNames['AGED_PRS']){
		const result = await agedPRCount(accessResp.token, reqOwner, repo, apiEndPoint);
		output['AGED_PRS'] = result;
	}
	if(reportNames['YOUR_CONTRIBUTION']){
		const result = await yourContribution(accessResp.token, reqOwner, repo, apiEndPoint);
		output['YOUR_CONTRIBUTION'] = result;
	}
	return output;
}





