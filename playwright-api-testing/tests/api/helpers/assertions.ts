/*
 *  Copyright (c) 2024 Suhila Ahmed - ABN AMRO.
 *
 * Unauthorized copying of this file via any medium IS STRICTLY PROHIBITED.
 * Proprietary and confidential.
 *
 * The above copyright notice shall be included in all copies or
 * substantial portions of the Software.
 */
import { expect } from '@playwright/test'
import { Issue } from '../../../models/issues'
import moment from 'moment'

export class apiAssertions {
  async assertProjectIdIsNotNull(issue: Issue) {
    expect(issue.project_id).not.toBe(null)
  }

  async assertProjectIdIsCorrect(issue: Issue, projectId: number) {
    expect(issue.project_id).toEqual(projectId)
  }

  async assertIssueIdIsNotNull(issue: Issue) {
    expect(issue.id).not.toBe(null)
  }

  async assertIssueInternalIdIsNotNull(issue: Issue) {
    expect(issue.iid).not.toBe(null)
  }

  async assertIssueTitleIsNotNull(issue: Issue) {
    expect(issue.title).not.toBe(null)
  }

  async assertIssueStateIsCorrect(issue: Issue, state: any) {
    expect(issue.state).toEqual(state)
  }

  async assertIssueConfidentialityIsCorrect(
    issue: Issue,
    confidentiality: any,
  ) {
    expect(issue.confidential).toEqual(confidentiality)
  }

  async assertIssueHasAssigness(issue: Issue) {
    expect(issue.assignees).not.toBe([])
  }

  async assertIssueHasCorrectAuthor(issue: Issue, author: any) {
    expect(issue.author).toEqual(author)
  }

  async assertIssueTypeIsCorrect(issue: Issue) {
    expect(issue.type).toEqual('ISSUE')
  }

  async assertIssueContainsCorrectLabels(issue: Issue, labels: any) {
    expect(labels).toEqual(expect.arrayContaining(issue.labels))
  }

  async assertIssueContainsCorrectState(issue: Issue, state: any) {
    expect(state).toContain(issue.state)
  }

  async assertCreatedAtTimeOfIssueIsValid(issue: Issue) {
    expect(moment(issue.created_at, true).isValid())
  }

  async assertUpdatedAtTimeOfIssueIsValid(issue: Issue) {
    expect(moment(issue.updated_at, true).isValid())
  }

  async assertProjectIsNotFound(response: any) {
    const jsonResponse = await response.json()
    expect(jsonResponse.message).toEqual('404 Project Not Found')
  }

  async assertIssueIsNotFound(response: any) {
    const jsonResponse = await response.json()
    expect(jsonResponse.message).toEqual('404 Issue Not Found')
  }

  async assertIdIsNotFound(response: any) {
    const jsonResponse = await response.json()
    expect(jsonResponse.message).toEqual('404 Not found')
  }

  async assertApiStatusCodeIs404(response: any) {
    expect(await response.status()).toBe(404)
  }

  async assertIssueTitleShouldNotBeEmpty(response: any) {
    const jsonResponse = await response.json()
    expect(jsonResponse.message.title[0]).toEqual("can't be blank")
  }

  async assertRequestIsUnAuthorized(response: any) {
    expect(await response.status()).toBe(401)
    const jsonResponse = await response.json()
    expect(jsonResponse.message).toEqual('401 Unauthorized')
  }

  async assertRequestParamtersAreIncorrect(response: any, error: any) {
    expect(await response.status()).toBe(400)
    const jsonResponse = await response.json()
    expect(jsonResponse.error).toEqual(error)
  }

  async assertIssueIsDeletedSuccessfully(response: any) {
    expect(await response.status()).toBe(204)
  }

  async assertApisIsReturningInternalServerError(response: any) {
    expect(await response.status()).toBe(500)
    const jsonResponse = await response.json()
    expect(jsonResponse.message).toEqual('500 Internal Server Error')
  }

  async assertListOfIssuesIsNotEmpty(issues: any) {
    expect(issues != null || {})
  }
}
