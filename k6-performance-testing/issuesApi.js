/*
 *  Copyright (c) 2024 Suhila Ahmed - ABN AMRO.
 *
 * Unauthorized copying of this file via any medium IS STRICTLY PROHIBITED.
 * Proprietary and confidential.
 *
 * The above copyright notice shall be included in all copies or
 * substantial portions of the Software.
 */

import { sleep, group, check } from "k6";
import { Rate } from 'k6/metrics';
import http from "k6/http";
import { make_random_word, test_mode, base_url, stages, projectId, private_access_token } from "./helpers.js";

console.log("Configuration", JSON.stringify({ test_mode, base_url, stages }));


// Define option of the k6 test
export let options = {
    stages: stages,
      thresholds :{
          errors: ['rate<0.1'] //Condition - Fail load tets if 10% of resuetts gets failed
      }
};

// Defining error rate
export let errorRate = new Rate('errors');

export default function main() {
    // performing checking on status codes 
    const check_error = (response) => {
        const result = check(response, {
            'status is correct!': (r) => r.status === 200 || r.status === 201 || r.status === 204
        },
            { endpoint: response.url, status: response.status });
        if (!result) { // "If" should be there because errorRate graph in grafana wont work.
            //console.warn(response.request.url, response.status, JSON.stringify(response.body))
            errorRate.add(!result);   //Adding errorRate in case of check failure
        }
    };
    let response;
    const title = make_random_word(5);
    let issueId;
    group("Create new issue", function () {
        response = http.post(
          `${base_url}/projects/${projectId}/issues?title=${title}&labels=bug`,
          {},
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "PRIVATE-TOKEN": private_access_token,
              "content-type": "application/json; charset=UTF-8"
            },
          }
        );
        check_error(response)
        check(response, { 'issue created successfully': (r) => r.body.length > 0 });
        sleep(2);
    });
    group("Update created issue", function () {
      issueId = JSON.parse(response.body)["iid"]
        response = http.put(
          `${base_url}/projects/${projectId}/issues/${issueId}?state_event=close`,
           {},
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "content-type": "application/json; charset=UTF-8",
              "PRIVATE-TOKEN": private_access_token,
            },
          }
        );
        check_error(response)
        check(response, { 'issue updated successfully': (r) => r.body.length > 0 });
        check(response, { 'issue state is closed': (r) => r.json('state') === "closed" });
        sleep(5);
    });
    group("Delete created issue ", function () {
        response = http.del(
          `${base_url}/projects/${projectId}/issues/${issueId}`,
          null,
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "PRIVATE-TOKEN": private_access_token
            },
          }
        );
        check_error(response)
        check(response, { 'issue is deleted successfully': (r) => r.body === null });

        sleep(3)
      });
    group("Read all issues ", function () {
      response = http.get(`${base_url}/issues`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "PRIVATE-TOKEN": private_access_token
          },
        });
        check_error(response)
        check(response, { 'Available issues list': (r) => r.body.length > 0 });
      });
    }