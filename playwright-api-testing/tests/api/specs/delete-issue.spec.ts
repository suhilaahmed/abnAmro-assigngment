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
  projectId,
} from '../../../utils/test-data/issues-data'
import { apiAssertions } from '../helpers/assertions'
import { Issue } from '../../../models/issues'

/*
 * Module variables
 */

const api = new issuesApi()
const assertions = new apiAssertions()
let issueInternalId: number

/*
 * Module
 */

// A straight forward set of test cases to delete an issue that belong to a project.

test.describe('Delete an issue that belong to a specific project - Happy Flows', () => {
  test.beforeAll(async ({ request }) => {
    const createNewIssueResponse = await api.createIssue(
      request,
      projectId,
      randomeTitle,
      labels.slice(-1)[0],
    )

    const issue: Issue = await createNewIssueResponse.json()
    issueInternalId = issue.iid
  })

  test('Delete an issue using valid internal issue Id', async ({ request }) => {
    const deleteIssueResponse = await api.deleteIssue(
      request,
      projectId,
      issueInternalId,
    )
    await assertions.assertIssueIsDeletedSuccessfully(deleteIssueResponse)
  })
})

// Making sure that when passing incorrect project id or issue id the issue is not deleted

test.describe('Delete an issue that belong to a specific project - Unhappy Flows', () => {
  const randomId =
    Math.floor(Math.random() * 100) + Math.floor(Date.now() / 1000)
  test('Delete an issue using invalid project Id', async ({ request }) => {
    const errorResponse = await api.deleteIssue(
      request,
      randomId,
      issueInternalId,
    )
    await assertions.assertApiStatusCodeIs404(errorResponse)
    await assertions.assertProjectIsNotFound(errorResponse)
  })

  test('Delete an issue using invalid internal issue Id', async ({
    request,
  }) => {
    const errorResponse = await api.deleteIssue(request, projectId, randomId)
    await assertions.assertApiStatusCodeIs404(errorResponse)
    await assertions.assertIssueIsNotFound(errorResponse)
  })

  test('Delete an issue without private token', async ({ request }) => {
    const errorResponse = await api.deleteIssueWithoutPrivateToken(
      request,
      projectId,
      issueInternalId,
    )
    await assertions.assertRequestIsUnAuthorized(errorResponse)
  })
})
