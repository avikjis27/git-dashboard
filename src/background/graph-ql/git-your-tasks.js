import { graphql } from "@octokit/graphql"
import {whoami} from "./git-who-am-i"

const QUERY = 
`query openPRs($q: String!, $next: String) {
  search(query: $q, type: ISSUE, first:10, after: $next) {
    edges{
      node{
        ... on PullRequest{
          number
          url
        }
      }
		}
		pageInfo {
			hasNextPage
			endCursor
		}
  }
}`;




async function getPRLists(accessToken, query, ep) {
	const prList = []
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	let nextCursor = null;
	while(true){
		const response = await graphqlWithAuth(QUERY, {
			q: query,
			next: nextCursor
		});
		response.search.edges.forEach(item => {
			const url = item.node.url;
			const number = item.node.number;
			prList.push({
				url:url,
				number: number
			})
		});
		if(!response.search.pageInfo.hasNextPage){
			break;
		}else{
			nextCursor = response.search.pageInfo.endCursor;
		}
	}
	return prList
}

function findOpenPRRequiredReview(openNonDraftPR, prReviewdByMe){
	const openPRRequiredReview = openNonDraftPR.filter(openPR => {
		const reviewPR = prReviewdByMe.find(reviewedPR => {
			return reviewedPR.number === openPR.number
		});
		return reviewPR == null ? true: false;
	});
	return openPRRequiredReview;
}

export async function yourTasks(accessToken, owner, repo, ep) {
	const result = {}
	
	const me = await whoami(accessToken, ep)
	try{
		let openNonDraftPR= await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open draft:false", ep)
		let prReviewdByMe = await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open reviewed-by:"+me, ep)
		let prNeedToMerge = await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open review:approved author:"+me, ep)
		let changeRequested = await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open review:changes_requested author:"+me, ep)
		result['openPRRequiredReview'] = findOpenPRRequiredReview(openNonDraftPR, prReviewdByMe)
		result['prNeedToMerge'] = prNeedToMerge
		result['changeRequested'] = changeRequested
	}catch(error){
		console.log("Request failed:", error.request);
		console.error(error.message);
	}
	return result;
}