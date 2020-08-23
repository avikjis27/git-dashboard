import { graphql } from "@octokit/graphql"

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

export async function yourTasks(accessToken, owner, repo, ep) {
	const result = {}
	try{
		let openPRRequiredReview = await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open draft:false review:required", ep)
		let prNeedToMerge = await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open review:approved author:@me", ep)
		let changeRequested = await getPRLists(accessToken, "repo:"+owner+"/"+repo+" is:pr state:open review:changes_requested author:@me", ep)
		result['openPRRequiredReview'] = openPRRequiredReview
		result['prNeedToMerge'] = prNeedToMerge
		result['changeRequested'] = changeRequested
	}catch(error){
		console.log("Request failed:", error.request);
		console.log(error.message);
	}
	return result;
}