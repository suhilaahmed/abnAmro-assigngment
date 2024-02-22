import { APIRequestContext, expect } from '@playwright/test'
import { Issue } from '../../models/issues'
import * as dotenv from 'dotenv'
dotenv.config()

export class issuesApi {
  async createIssue(
    request: APIRequestContext,
    projectId: number,
    title: string,
    label: string,
  ) {
    const createNewIssueResponse = await request.post(
      `projects/${projectId}/issues?title=${title}&labels=${label}`,
      {
        headers: {
          'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN || '',
        },
      },
    )

    if (createNewIssueResponse.status() != 201) {
      return createNewIssueResponse
    }
    expect(createNewIssueResponse.status()).toBe(201)
    return createNewIssueResponse
  }

  async createIssueWithoutPrivateToken(
    request: APIRequestContext,
    projectId: number,
    title: string,
    label: string,
  ) {
    const createNewIssueResponse = await request.post(
      `projects/${projectId}/issues?title=${title}&labels=${label}`,
      {
        headers: {
          'PRIVATE-TOKEN': '',
        },
      },
    )

    expect(createNewIssueResponse.status()).toBe(401)
    return createNewIssueResponse
  }

  async deleteIssue(
    request: APIRequestContext,
    projectId: number,
    issueId: number,
  ) {
    const deleteIssueResponse = await request.delete(
      `projects/${projectId}/issues/${issueId}`,
      {
        headers: {
          'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN || '',
        },
      },
    )

    if (deleteIssueResponse.status() != 204) {
      return deleteIssueResponse
    }

    expect(deleteIssueResponse.status()).toBe(204)
    return deleteIssueResponse
  }

  async deleteIssueWithoutPrivateToken(
    request: APIRequestContext,
    projectId: number,
    issueId: number,
  ) {
    const deleteIssueResponse = await request.delete(
      `projects/${projectId}/issues/${issueId}`,
      {
        headers: {
          'PRIVATE-TOKEN': '',
        },
      },
    )

    expect(deleteIssueResponse.status()).toBe(401)
    return deleteIssueResponse
  }

  public async listAllIssuesToUser(request: APIRequestContext) {
    const issues = await request.get(`issues/`, {
      headers: {
        'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN || '',
      },
    })
    return issues.json()
  }

  public async listAllAvailableIssues(
    request: APIRequestContext,
    paramter: any,
    value: any,
  ) {
    const issues = await request.get(`issues?${paramter}=${value}`, {
      headers: {
        'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN || '',
      },
    })
    return issues
  }

  public async listAllIssuesUnderProject(
    request: APIRequestContext,
    projectId: number,
  ) {
    const issuesResponse = await request.get(`projects/${projectId}/issues`, {
      headers: {
        'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN || '',
      },
    })
    return issuesResponse
  }

  public async listAllAvailableIssuesWithoutPrivateToken(
    request: APIRequestContext,
  ) {
    const readResponse = await request.get(`issues`, {
      headers: {
        'PRIVATE-TOKEN': '',
      },
    })

    expect(readResponse.status()).toBe(401)
    return readResponse
  }

  public async readByIssueId(
    request: APIRequestContext,
    id: number,
  ): Promise<Issue> {
    return this.readById(
      async (): Promise<Issue[]> => this.listAllIssuesToUser(request),
      id,
    )
  }

  public async updateAnIssue(
    request: APIRequestContext,
    paramter: string,
    value: any,
    issueId: any,
    projectId: number,
  ) {
    const updateIssueResponse = await request.put(
      `projects/${projectId}/issues/${issueId}?${paramter}=${value}`,
      {
        headers: {
          'PRIVATE-TOKEN': process.env.PRIVATE_ACCESS_TOKEN || '',
        },
      },
    )
    if (updateIssueResponse.status() != 200) {
      return await updateIssueResponse
    }
    expect(updateIssueResponse.status()).toBe(200)
    return await updateIssueResponse.json()
  }

  public async updateAnIssueWithoutPrivateToken(
    request: APIRequestContext,
    paramter: string,
    value: any,
    issueId: number,
    projectId: number,
  ) {
    const updateIssueResponse = await request.put(
      `projects/${projectId}/issues/${issueId}?${paramter}=${value}`,
      {
        headers: {
          'PRIVATE-TOKEN': '',
        },
      },
    )
    expect(updateIssueResponse.status()).toBe(401)
    return updateIssueResponse
  }

  public async readById<T extends { id: number }>(
    callback: () => Promise<T[]>,
    id: number,
  ): Promise<T> {
    const data = await callback()
    const found = data.find(({ id: foundId }) => foundId === id)

    if (typeof found === 'undefined') {
      throw new Error(`Unable to find issue with id:  ${id}`)
    }
    return found
  }
}
