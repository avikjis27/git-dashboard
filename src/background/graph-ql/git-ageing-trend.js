import { graphql } from "@octokit/graphql"

const QUERY_PR_AGEING_TREND = `query prAgingTrend($owner: String!, $repo: String!, $next: String){
	repository(owner: $owner, name: $repo) {
		pullRequests(states: MERGED, orderBy: {field: CREATED_AT, direction: DESC}, first:100, after: $next){
			edges{
        node{
          createdAt
          mergedAt
          url
        }
      }
			pageInfo {
        hasNextPage
        endCursor
      }
		}
	}
}`;

export async function prAgeingTrend(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	const result = []
	try{
		let nextCursor = null;
		while(true){
			const response = await graphqlWithAuth(QUERY_PR_AGEING_TREND, {
				repo: repo,
				owner: owner,
				next: nextCursor
			});
			response.repository.pullRequests.edges.forEach(item => {
				const url = item.node.url;
				const createdAt = Date.parse(item.node.createdAt);
				const mergedAt = Date.parse(item.node.mergedAt);
				const diffDays = parseInt((mergedAt - createdAt) / (1000 * 60 * 60 * 24), 10);
				const pr = {
					createdAt: createdAt,
					age: diffDays,
					url: url,
				};
				result.push(pr);
			});
			if(!response.repository.pullRequests.pageInfo.hasNextPage){
				break;
			}else{
				nextCursor = response.repository.pullRequests.pageInfo.endCursor;
			}
		}
		
	}catch(error){
		console.log("Request failed:", error.request);
		console.error(error.message);
	}
	return result;
}
