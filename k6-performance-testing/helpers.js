import { config } from "./config.js";

// random word generator
export function make_random_word(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};

//Define constant variables 
export const test_mode = __ENV.test_mode;  // smoke, load, stress, soak
export const base_url = config["base_url"]; // base_url of the site defined in config
export const stages = config[test_mode]["stages"] // defining stages used in options
export const  projectId = config["projectId"]
export const private_access_token = __ENV.token
