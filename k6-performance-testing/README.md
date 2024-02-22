# K6 Load Test for Gitlab Issues API

k6 Load testing scripts which implements Smoke, Load, Stress and Soak tests scenarios on Gitlab Issues API https://docs.gitlab.com/ee/api/issues.html.
Additionally it stores the results in Influxdb an could be visualized in Grafana.

## Prerequisites

- npm
- Docker
- Any IDE you comfortable with (eg. IntelliJ, VSCode)

## Installation

### Install k6

Follow the installation instructions provided on https://k6.io/docs/get-started/installation/ or for MacOs:

```shell
brew install k6
```

### Setup Influx and Grafana

1. Up the `docker-compose.yaml` file with:

```shell
docker-compose -d up
```

You should be able to see Grafana dashboard on http://localhost:3000

Its default username and password is: `admin`

2.  Create a data source with below configurations:

![influx-config](screenshots/influx-config.png)

2.  Import the pre-configured Exa dashboard by id: `15080` or by the [link](https://grafana.com/grafana/dashboards/15080)

## Run the test

1. Clone the repository

2. change directory to files:

```shell
cd files
```

Run k6 with the desired test mode. Wait for the test to get accomplished.

```shell
npm run test
```

You can choose the *test_mode* value according to the below options.

- **smoke**: Targets the functionality of the system under the lowest load: Is it working with only one user?

- **load**: Targets the system under normal usage by the users. You should ask: How many users are using the system simultaneously typically and how long is their session?

- **stress**: What is the maximum capacity of the system? How many users with what kind of behavior should use the site to disrate its quality due to the SLO: i.e. availability, request latency, throughput and etc.

- **soak**: Would the system last for a long time(normally hours to days) under normal conditions? It’s working for 15min under normal condition in the load test but is feasible for a much longer time?

3. Now you can get back to the imported [grafana dashboard](http://localhost:3000) and see the results.
