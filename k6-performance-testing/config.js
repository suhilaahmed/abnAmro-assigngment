// defining test modes
const stages_smoke = [
    { duration: '10s', target: 1 } // 1 user for 1 minute
];

// load testing to find the maximum amount of load the system can handle.
const stages_load = [
    { duration: '2m', target: 30 }, // simulate ramp-up of traffic from 1 to 30 users over 2 minutes.
    { duration: '2m', target: 50 }, // stay at 50 users for 2 minutes
    { duration: '2m', target: 0 }, // ramp-down to 0 users
];

// load testing to find the maximum amount of load the system can handle.

const stages_stress = [
    { duration: '2m', target: 20 }, // below normal load
    { duration: '2m', target: 20 },
    { duration: '2m', target: 50 }, // around normal load
    { duration: '5m', target: 50 },
    { duration: '2m', target: 120 }, // ramping out to beaking point
    { duration: '5m', target: 120 },
    { duration: '2m', target: 200 }, // beyond the breaking point
    { duration: '5m', target: 200 },
    { duration: '5m', target: 0 }, // scale down. Recovery stage.
];

// load testing a system continuously and monitoring for memory leaks and behavior of the system.
const stages_soak = [
    { duration: '2m', target: 25 }, // ramp up to  25users(80% of the normal capacity)
    { duration: '3h56m', target: 25 }, // stay at 25 for ~4 hours
    { duration: '2m', target: 0 }, // scale down. (optional)
];
export const config = {
    base_url: "https://gitlab.com/api/v4/",   // base url of the site
    projectId: "37824603",
    smoke: {
        stages: stages_smoke
    },
    load: {
        stages: stages_load
    },
    stress: {
        stages: stages_stress
    },
    soak: {
        stages: stages_soak
    }
};
