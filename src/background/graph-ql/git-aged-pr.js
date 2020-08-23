import { graphql } from "@octokit/graphql"

const QUERY_PR_AGE_COUNT = `query agedPRCount($owner: String!, $repo: String!, $next: String){
	repository(owner: $owner, name: $repo) {
		pullRequests(states: OPEN, first: 10, after: $next){
			edges{
        node{
					title
					url
					number
					createdAt
          author{
            login
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

export async function agedPRCount(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	const today = Date.now();
	const result = {}
	try{
		let nextCursor = null;
		while(true){
			const response = await graphqlWithAuth(QUERY_PR_AGE_COUNT, {
				repo: repo,
				owner: owner,
				next: nextCursor
			});
			response.repository.pullRequests.edges.forEach(item => {
				const url = item.node.url;
				const title = item.node.title;
				const number = item.node.number;
				const createdAt = Date.parse(item.node.createdAt);
				const author = item.node.author.login
				const diffDays = parseInt((today - createdAt) / (1000 * 60 * 60 * 24), 10);
				const pr = {
					title: title,
					number: number,
					url: url,
					author: author
				};
				if(result[diffDays]){
					result[diffDays].push(pr)
				} else {
					result[diffDays] = [pr]
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
		console.log(error.message);
	}
	return result;
}
