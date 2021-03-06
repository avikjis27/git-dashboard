import { graphql } from "@octokit/graphql"

const QUERY_ALL_OPEN_PR_COUNT = `query totalOpenPR($owner: String!, $repo: String!){
	repository(owner: $owner, name: $repo) {
		pullRequests(states: OPEN){
			totalCount
		}
	}
}`;

export async function getOpenPRCount(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	let openPRCount = 0;
	try{
		const response = await graphqlWithAuth(QUERY_ALL_OPEN_PR_COUNT, {
			"owner": owner,
			"repo": repo,
		});
		openPRCount = response.repository.pullRequests.totalCount.toString();
	}catch(error){
		console.log("Request failed:", error.request);
		console.error(error.message);
	}
	return openPRCount;
}