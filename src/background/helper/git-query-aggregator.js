import {fetchAccessToken} from '../data-access/access-token'
import {fetchAPIEndPoint} from '../data-access/api-endpoint'
import {getOpenPRCount} from '../graph-ql/git-open-pr'
import {getOpenIssueCount} from '../graph-ql/git-open-issue'
import {yourOpenPRs} from '../graph-ql/git-your-pr'
import {agedPRCount} from '../graph-ql/git-aged-pr'
import {yourContribution} from '../graph-ql/git-your-contribution'

export async function aggregator(reqDomain, reqOwner, repo, reportNames ) {
	const output = {};	
	const accessResp = await fetchAccessToken(reqDomain);
	const apiEndPoint = await fetchAPIEndPoint(reqDomain);
	if(!accessResp.token){
		console.warn("Access token not set for the domain "+ reqDomain);
		return;
	}
	if(reportNames['OPEN_PR']){
		const count = await getOpenPRCount(accessResp.token, reqOwner, repo, apiEndPoint.endPoint);
		output['OPEN_PR'] = count;
	}
	if(reportNames['OPEN_ISSUES']){
		const count = await getOpenIssueCount(accessResp.token, reqOwner, repo, apiEndPoint.endPoint);
		output['OPEN_ISSUES'] = count;
	}
	if(reportNames['OWN_PR_STATUS']){
		const result = await yourOpenPRs(accessResp.token, reqOwner, repo, apiEndPoint.endPoint);
		output['OWN_PR_STATUS'] = result;
	}
	if(reportNames['AGED_PRS']){
		const result = await agedPRCount(accessResp.token, reqOwner, repo, apiEndPoint.endPoint);
		console.log("AGED_PRS result", result)
		output['AGED_PRS'] = result;
	}
	if(reportNames['YOUR_CONTRIBUTION']){
		const result = await yourContribution(accessResp.token, reqOwner, repo, apiEndPoint.endPoint);
		console.log("YOUR_CONTRIBUTION result", result)
		output['YOUR_CONTRIBUTION'] = result;
	}
	return output;
}





