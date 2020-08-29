import { graphql } from "@octokit/graphql"

const QUERY_ALL_OPEN_ISSUE_COUNT = `query totalOpenIssues($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    issues(states:OPEN) {
      totalCount
    }
  }
}`;

export async function getOpenIssueCount(accessToken, owner, repo, ep) {
	const graphqlWithAuth = graphql.defaults({
		baseUrl: ep,
		headers: {
			authorization: "token " + accessToken,
		},
	});
	let openIssueCount = 0;
	try{
		const response = await graphqlWithAuth(QUERY_ALL_OPEN_ISSUE_COUNT, {
			"owner": owner,
			"repo": repo,
		});
		openIssueCount = response.repository.issues.totalCount.toString();
	}catch(error){
		console.log("Request failed:", error.request);
		console.error(error.message);
	}
	return openIssueCount;
}