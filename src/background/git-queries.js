import { graphql } from "@octokit/graphql"

const graphqlWithAuth = graphql.defaults({
	headers: {
		authorization: `token e6bb9153f1cda5d4ffc38d39121090681d9e9b3c`,
	},
});

const QUERY_ALL_OPEN_PR_COUNT = `{
	repository(owner: "octokit", name: "graphql.js") {
		pullRequests(states: OPEN){
			totalCount
		}
	}
}`;

const QUERY_REQUESTED_USERS_REVIEW = `
query requestedReview($owner: String!, $repo: String!, $pr_cursor: String, $review_cursor: String)
{
  repository(owner: $owner, name: $repo) {
    pullRequests(states: OPEN, first: 10, after: $pr_cursor) {
      edges {
        node {
          reviewRequests(first: 10, after: $review_cursor) {
            edges {
              node {
                requestedReviewer {
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
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`;

export async function getReviewRequestCount() {
	let reviewRequestCount = 0;
	let prCursor = null;
	let reviewCursor = null;
	let hasNextPRPage = true;
	let hasNextReviewPage = true;
	while(true){
		while(true){
			try {
				const page = await graphqlWithAuth(QUERY_REQUESTED_USERS_REVIEW, {
					"owner": "octokit",
					"repo": "graphql.js",
					"pr_cursor": prCursor,
					"review_cursor": reviewCursor
		
				});
				console.log(page);
				if(page.repository.pullRequests.edges.length > 0){
					reviewRequestCount += page.repository.pullRequests.edges.node.reviewRequests.edges.length;
					reviewCursor = page.repository.pullRequests.edges.node.reviewRequests.pageInfo.endCursor;
					hasNextReviewPage = page.repository.pullRequests.edges.node.reviewRequests.pageInfo.hasNextPage;
				}

				
				
			} catch (error) {
				console.log("Request failed:", error.request);
				console.log(error.message);
				return reviewRequestCount;
			} 
		}
		prCursor = page.repository.pullRequests.pageInfo.endCursor;
		hasNextPRPage = repository.pullRequests.pageInfo.hasNextPage;
	}
	return reviewRequestCount;
}