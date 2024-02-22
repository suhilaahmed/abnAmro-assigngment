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

import { test } from '@playwright/test'
import { issuesApi } from '../../../resources/api/issuesApi'
import {
  randomeTitle,
  labels,
  author,
  projectId,
  gitlabName,
  gitlabUserName,
} from '../../../utils/test-data/issues-data'
import { apiAssertions } from '../helpers/assertions'
import { Issue } from '../../../models/issues'

/*
 * Module variables
 */

const api = new issuesApi()
const assertions = new apiAssertions()
let userId: number
let createdIssueId: number

/*
 * Module
 */

// This suite is intended to create a new issue under a project with the required paramters

test.describe('Add a new issue to a project - Happy Flows', () => {
  test.beforeAll(async ({ request }) => {
    const issues = await api.listAllIssuesToUser(request)
    userId = issues[0].author.id
    author.username = gitlabUserName || ''
    author.name = gitlabName || ''
    author.avatar_url = issues[0].author.avatar_url
  })

  // Delete the created issue as a cleanup setp
  test.afterAll(async ({ request }) => {
    await api.deleteIssue(request, projectId, createdIssueId)
  })

  test('Add new issue to a project with valid project Id', async ({
    request,
  }) => {
    const createNewIssueResponse = await api.createIssue(
      request,
      projectId,
      randomeTitle,
      labels.slice(-1)[0],
    )

    const issue: Issue = await createNewIssueResponse.json()
    createdIssueId = issue.iid
    author.id = userId

    await assertions.assertProjectIdIsNotNull(issue)
    await assertions.assertProjectIdIsCorrect(issue, projectId)

    await assertions.assertIssueIdIsNotNull(issue)
    await assertions.assertIssueInternalIdIsNotNull(issue)

    await assertions.assertIssueTitleIsNotNull(issue)
    await assertions.assertIssueStateIsCorrect(issue, 'opened')

    await assertions.assertIssueHasAssigness(issue)
    await assertions.assertIssueTypeIsCorrect(issue)

    await assertions.assertIssueHasCorrectAuthor(issue, author)
    await assertions.assertIssueContainsCorrectLabels(issue, labels)

    await assertions.assertCreatedAtTimeOfIssueIsValid(issue)
    await assertions.assertUpdatedAtTimeOfIssueIsValid(issue)
  })
})

test.describe('Add a new issue to a project - Unhappy Flows', () => {
  test('Add new issue to a project with invalid project Id', async ({
    request,
  }) => {
    const randomProjectId =
      Math.floor(Math.random() * 100) + Math.floor(Date.now() / 1000)
    const errorResponse = await api.createIssue(
      request,
      randomProjectId,
      randomeTitle,
      labels.slice(-1)[0],
    )
    await assertions.assertApiStatusCodeIs404(errorResponse)
    await assertions.assertProjectIsNotFound(errorResponse)
  })

  test('Add new issue to a project without a title', async ({ request }) => {
    const errorResponse = await api.createIssue(
      request,
      projectId,
      ' ',
      labels.slice(-1)[0],
    )
    await assertions.assertIssueTitleShouldNotBeEmpty(errorResponse)
  })

  test('Add new issue to a project without private token', async ({
    request,
  }) => {
    const errorResponse = await api.createIssueWithoutPrivateToken(
      request,
      projectId,
      randomeTitle,
      labels.slice(-1)[0],
    )
    await assertions.assertRequestIsUnAuthorized(errorResponse)
  })
})
