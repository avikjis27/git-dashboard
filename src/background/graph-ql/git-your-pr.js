import { graphql } from "@octokit/graphql"

const QUERY_YOUR_OPEN_PRS = 
`query yourOpenPRs($owner: String!, $repo: String!, $next: String) {
  repository(owner: $owner, name: $repo) {
    pullRequests(states: OPEN, first: 100, after: $next) {
      edges {
        node {
          reviewDecision
          title
          url
          author {
            ... on User {
              isViewer
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`;

export async function yourOpenPRs(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	const result = {
		"REVIEW_REQUIRED":[],
		"APPROVED":[],
		"CHANGES_REQUESTED":[]
	}
	try{
		let nextCursor = null;
		while(true){
			const response = await graphqlWithAuth(QUERY_YOUR_OPEN_PRS, {
				repo: repo,
				owner: owner,
				next: nextCursor
			});
			response.repository.pullRequests.edges.forEach(item => {
				const url = item.node.url;
				const title = item.node.title;
				const isViewer = item.node.author ? item.node.author.isViewer : null;
				if(isViewer){
					if(item.node.reviewDecision !== null ){
						result[item.node.reviewDecision].push({"url": url, "title": title})
					}else{
						result[REVIEW_REQUIRED].push({"url": url, "title": title})
					}
					
				}
				
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