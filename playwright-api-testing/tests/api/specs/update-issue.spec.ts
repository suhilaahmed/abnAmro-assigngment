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
import { apiAssertions } from '../helpers/assertions'
import {
  labels,
  projectId,
  randomeTitle,
} from '../../../utils/test-data/issues-data'
import { Issue } from '../../../models/issues'

/*
 * Module variables
 */
const api = new issuesApi()
const assertions = new apiAssertions()
let createdIssueId: number
let issue: Issue

/*
 * Module
 */

test.describe('Update an existing project issue - Happy Flows', () => {
  test.beforeAll(async ({ request }) => {
    const createNewIssueResponse = await api.createIssue(
      request,
      projectId,
      randomeTitle,
      labels.slice(-1)[0],
    )
    issue = await createNewIssueResponse.json()
    createdIssueId = issue.iid
  })

  // Delete the created issue as a cleanup setp
  test.afterAll(async ({ request }) => {
    await api.deleteIssue(request, projectId, createdIssueId)
  })

  //This test is created to mark the issue as closed and to assert on that
  test('Update Issue - mark a issue that belong to a project to be closed', async ({
    request,
  }) => {
    await assertions.assertIssueStateIsCorrect(issue, 'opened')

    const updateIssue = await api.updateAnIssue(
      request,
      'state_event',
      'close',
      createdIssueId,
      projectId,
    )

    await assertions.assertIssueStateIsCorrect(updateIssue, 'closed')
  })

  //This test is created to mark the issue as confidential and to assert on that

  test('Update Issue - mark a issue that belong to a project to be confidential', async ({
    request,
  }) => {
    await assertions.assertIssueConfidentialityIsCorrect(issue, false)

    const updateIssue = await api.updateAnIssue(
      request,
      'confidential',
      true,
      createdIssueId,
      projectId,
    )

    await assertions.assertIssueConfidentialityIsCorrect(updateIssue, true)
  })
})

// This test suite mainly target providing incorrect values and missing the private token
test.describe('Update an existing project issue - Unhappy Flows', () => {
  test.beforeAll(async ({ request }) => {
    const createNewIssueResponse = await api.createIssue(
      request,
      projectId,
      randomeTitle,
      labels.slice(-1)[0],
    )
    issue = await createNewIssueResponse.json()
    createdIssueId = issue.iid
  })

  test.afterAll(async ({ request }) => {
    await api.deleteIssue(request, projectId, createdIssueId)
  })

  test('Update Issue - update state event of an issue with incorrect value', async ({
    request,
  }) => {
    const errorResponse = await api.updateAnIssue(
      request,
      'state_event',
      randomeTitle,
      createdIssueId,
      projectId,
    )

    await assertions.assertRequestParamtersAreIncorrect(
      errorResponse,
      'state_event does not have a valid value',
    )
  })

  test('Update Issue - update the confidentiality of an issue with incorrect value', async ({
    request,
  }) => {
    const errorResponse = await api.updateAnIssue(
      request,
      'confidential',
      randomeTitle,
      createdIssueId,
      projectId,
    )

    await assertions.assertRequestParamtersAreIncorrect(
      errorResponse,
      'confidential is invalid',
    )
  })

  test('Update Issue - update the issue with non existing parameter', async ({
    request,
  }) => {
    const errorResponse = await api.updateAnIssue(
      request,
      randomeTitle,
      randomeTitle,
      createdIssueId,
      projectId,
    )
    await assertions.assertRequestParamtersAreIncorrect(
      errorResponse,
      'assignee_id, assignee_ids, confidential, created_at, description, discussion_locked, due_date, labels, add_labels, remove_labels, milestone_id, state_event, title, issue_type, weight, epic_id, epic_iid are missing, at least one parameter must be provided',
    )
  })

  test('Update Issue - update the issue with incorrect project id', async ({
    request,
  }) => {
    const randomProjectId =
      Math.floor(Math.random() * 100) + Math.floor(Date.now() / 1000)
    const errorResponse = await api.updateAnIssue(
      request,
      'title',
      'closed',
      createdIssueId,
      randomProjectId,
    )

    await assertions.assertProjectIsNotFound(errorResponse)
  })

  test('Update Issue - update the issue with invalid issue id', async ({
    request,
  }) => {
    const errorResponse = await api.updateAnIssue(
      request,
      'title',
      'closed',
      'invalidId',
      projectId,
    )

    await assertions.assertRequestParamtersAreIncorrect(
      errorResponse,
      'issue_iid is invalid',
    )
  })

  test('Update Issue - update the issue with incorrect issue id', async ({
    request,
  }) => {
    const randomIssueId =
      Math.floor(Math.random() * 100) + Math.floor(Date.now() / 1000)
    const errorResponse = await api.updateAnIssue(
      request,
      'title',
      'closed',
      randomIssueId,
      projectId,
    )
    await assertions.assertIdIsNotFound(errorResponse)
  })

  test('Update Issue - update the issue without private token', async ({
    request,
  }) => {
    const errorResponse = await api.updateAnIssueWithoutPrivateToken(
      request,
      'title',
      'closed',
      createdIssueId,
      projectId,
    )

    await assertions.assertRequestIsUnAuthorized(errorResponse)
  })
})
