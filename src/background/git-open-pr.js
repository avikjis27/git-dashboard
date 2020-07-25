import { graphql } from "@octokit/graphql"

const graphqlWithAuth = graphql.defaults({
	headers: {
		authorization: `token e6bb9153f1cda5d4ffc38d39121090681d9e9b3c`,
	},
});

const QUERY_ALL_OPEN_PR_COUNT = `query totalOpenPR($owner: String!, $repo: String!){
	repository(owner: $owner, name: $repo) {
		pullRequests(states: OPEN){
			totalCount
		}
	}
}`;

export async function getOpenPRCount() {
	let openPRCount = 0;
	try{
		const response = await graphqlWithAuth(QUERY_ALL_OPEN_PR_COUNT, {
			"owner": "hashicorp",
			"repo": "terraform",
		});
		openPRCount = response.repository.pullRequests.totalCount;
	}catch(error){
		console.log("Request failed:", error.request);
		console.log(error.message);
	}
	return openPRCount;
}