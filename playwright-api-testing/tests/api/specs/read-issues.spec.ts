/*
 *  Copyright (c) 2024 Suhila Ahmed - ABN AMRO.
 *
 * Unauthorized copying of this file via any medium IS STRICTLY PROHIBITED.
 * Proprietary and confidential.
 *
 * The above copyright notice shall be included in all copies or
 * substantial portions of the Software.
 */

/*
 * Module dependencies
 */
import { test, expect } from '@playwright/test'
import { issuesApi } from '../../../resources/api/issuesApi'
import { apiAssertions } from '../helpers/assertions'
import {
  author,
  gitlabName,
  gitlabUserName,
  state,
  projectId,
} from '../../../utils/test-data/issues-data'

/*
 * Module variables
 */
const api = new issuesApi()
const assertions = new apiAssertions()
let userId: number
let issuesIds: number[] = []
let iids: number[] = []

/*
 * Module
 */

// In this test suite we will test the happy flows of getting list of available issues

// NOTE: in the ideal world each test should assert on a specific feature - and because this data is being generated in a random way,
//multiple assertions should be executed for each and every test to insure the consitency.

test.describe('Read all issues - Happy Flows', () => {
  test.beforeAll(async () => {
    author.username = gitlabUserName || ''
    author.name = gitlabName || ''
  })
  // gitlab issue: getting all issues available is resulting in 500 error

  test('Get list of all available issues', async ({ request }) => {
    const availableIssuesList = await api.listAllAvailableIssues(
      request,
      'scope',
      'all',
    )
    await assertions.assertApisIsReturningInternalServerError(
      availableIssuesList,
    )
  })

  test('Get list of all issues available to the user', async ({ request }) => {
    const issues = await api.listAllIssuesToUser(request)

    await assertions.assertListOfIssuesIsNotEmpty(issues)
    userId = issues[0].author.id

    // since most of the response is a randome changing values and not required,
    // the assertions will be based on the types of the values and assertions on the author of the issue.

    issues.forEach((issue) => {
      author.avatar_url = issue.author.avatar_url
      author.state = issue.author.state
      author.id = userId

      // this assertion is important as we need to make sure that the project id never changes for all issues under the project
      assertions.assertProjectIdIsNotNull(issue)
      assertions.assertProjectIdIsCorrect(issue, projectId)

      assertions.assertIssueIdIsNotNull(issue)
      assertions.assertIssueInternalIdIsNotNull(issue)

      assertions.assertIssueTitleIsNotNull(issue)
      assertions.assertIssueHasAssigness(issue)
      assertions.assertIssueTypeIsCorrect(issue)

      assertions.assertIssueContainsCorrectState(issue, state)

      assertions.assertIssueHasCorrectAuthor(issue, author)

      assertions.assertCreatedAtTimeOfIssueIsValid(issue)
      assertions.assertUpdatedAtTimeOfIssueIsValid(issue)

      issuesIds.push(issue.id)
      iids.push(issue.iid)
    })
  })

  test('Get list of all issues with state Opened', async ({ request }) => {
    const issuesJson = await api.listAllAvailableIssues(
      request,
      'state',
      'opened',
    )
    const issues = await issuesJson.json()

    await assertions.assertListOfIssuesIsNotEmpty(issues)

    issues.forEach((issue) => {
      // this assertion is important as we need to make sure that the project id never changes for all issues under the project
      assertions.assertProjectIdIsNotNull(issue)
      assertions.assertProjectIdIsCorrect(issue, projectId)

      assertions.assertIssueIdIsNotNull(issue)
      assertions.assertIssueInternalIdIsNotNull(issue)

      assertions.assertIssueTitleIsNotNull(issue)
      assertions.assertIssueHasAssigness(issue)
      assertions.assertIssueTypeIsCorrect(issue)

      assertions.assertCreatedAtTimeOfIssueIsValid(issue)
      assertions.assertUpdatedAtTimeOfIssueIsValid(issue)

      assertions.assertIssueStateIsCorrect(issue, 'opened')
    })
  })

  test('Get list of all issues with state Closed', async ({ request }) => {
    const issuesJson = await api.listAllAvailableIssues(
      request,
      'state',
      'closed',
    )
    const issues = await issuesJson.json()

    await assertions.assertListOfIssuesIsNotEmpty(issues)

    issues.forEach((issue) => {
      // this assertion is important as we need to make sure that the project id never changes for all issues under the project
      assertions.assertProjectIdIsNotNull(issue)
      assertions.assertProjectIdIsCorrect(issue, projectId)

      assertions.assertIssueIdIsNotNull(issue)
      assertions.assertIssueInternalIdIsNotNull(issue)

      assertions.assertIssueTitleIsNotNull(issue)
      assertions.assertIssueHasAssigness(issue)
      assertions.assertIssueTypeIsCorrect(issue)

      assertions.assertCreatedAtTimeOfIssueIsValid(issue)
      assertions.assertUpdatedAtTimeOfIssueIsValid(issue)

      assertions.assertIssueStateIsCorrect(issue, 'closed')
    })
  })
})

// In this test suite we will test the unhappy flows of getting list of available issues.
// ex: passing an incorrect paramter
test.describe('List all issues - Unhappy Flows', () => {
  test('Get issues list with incorrect parameter value - state = active', async ({
    request,
  }) => {
    const errorResponse = await api.listAllAvailableIssues(
      request,
      'state',
      'active',
    )
    await assertions.assertRequestParamtersAreIncorrect(
      errorResponse,
      'state does not have a valid value',
    )
  })

  test('Get issues list with incorrect boolean parameter value - confidential = abc', async ({
    request,
  }) => {
    const errorResponse = await api.listAllAvailableIssues(
      request,
      'confidential',
      'abc',
    )

    await assertions.assertRequestParamtersAreIncorrect(
      errorResponse,
      'confidential is invalid',
    )
  })
  test('Get issues list without a private token', async ({ request }) => {
    const errorResponse =
      await api.listAllAvailableIssuesWithoutPrivateToken(request)

    assertions.assertRequestIsUnAuthorized(errorResponse)
  })
})

// In this test suite we will test the flows of getting a singe issue by id

test.describe('List a single issue - Happy/Unhappy Flows', () => {
  test('Get issue with correct id', async ({ request }) => {
    for (const issueId of issuesIds) {
      let issue = await api.readByIssueId(request, issueId)

      // this assertion is important as we need to make sure that the project id never changes for all issues under the project

      await assertions.assertProjectIdIsNotNull(issue)
      await assertions.assertProjectIdIsCorrect(issue, projectId)

      await assertions.assertIssueIdIsNotNull(issue)
      await assertions.assertIssueInternalIdIsNotNull(issue)

      await assertions.assertIssueTitleIsNotNull(issue)
      await assertions.assertIssueContainsCorrectState(issue, state)

      await assertions.assertIssueHasAssigness(issue)
      await assertions.assertIssueTypeIsCorrect(issue)

      await assertions.assertCreatedAtTimeOfIssueIsValid(issue)
      await assertions.assertUpdatedAtTimeOfIssueIsValid(issue)
    }
  })

  test('Get issue with an incorrect id', async ({ request }) => {
    const randomIssueId =
      Math.floor(Math.random() * 100) + Math.floor(Date.now() / 1000)

    await expect(async () => {
      await api.readByIssueId(request, randomIssueId)
    }).rejects.toThrowError(`Unable to find issue with id:  ${randomIssueId}`)
  })
})

// In this test suite we will test the flows of getting list of available issues under a specific project

test.describe('List project issues - Happy/Unhappy Flows', () => {
  test('List issues under a correct project id', async ({ request }) => {
    const issuesResponse = await api.listAllIssuesUnderProject(
      request,
      projectId,
    )
    const issues = await issuesResponse.json()

    await assertions.assertListOfIssuesIsNotEmpty(issues)

    issues.forEach((issue) => {
      author.avatar_url = issue.author.avatar_url
      author.state = issue.author.state
      author.id = userId

      // this assertion is important as we need to make sure that the project id never changes for all issues under the project
      assertions.assertProjectIdIsNotNull(issue)
      assertions.assertProjectIdIsCorrect(issue, projectId)

      assertions.assertIssueIdIsNotNull(issue)
      assertions.assertIssueInternalIdIsNotNull(issue)

      assertions.assertIssueTitleIsNotNull(issue)
      assertions.assertIssueContainsCorrectState(issue, state)

      assertions.assertIssueHasAssigness(issue)
      assertions.assertIssueTypeIsCorrect(issue)

      assertions.assertCreatedAtTimeOfIssueIsValid(issue)
      assertions.assertUpdatedAtTimeOfIssueIsValid(issue)
    })
  })
  test('List issues under an incorrect project id', async ({ request }) => {
    const randomProjectId =
      Math.floor(Math.random() * 100) + Math.floor(Date.now() / 1000)

    const errorResponse = await api.listAllIssuesUnderProject(
      request,
      randomProjectId,
    )
    await assertions.assertApiStatusCodeIs404(errorResponse)
  })
})
