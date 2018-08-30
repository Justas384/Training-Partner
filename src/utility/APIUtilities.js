import {ACCESS_TOKEN, API_BASE_URL} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }

                return json;
            })
        );
};

// User related functions.

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/authentication/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/authentication/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

// Program related functions.

export function checkProgramTitleAvailability(programTitle, programId) {
    return request({
        url: API_BASE_URL + "/programs/checkProgramTitleAvailability?programTitle=" + programTitle + '&programId=' + programId,
        method: 'GET'
    });
}

export function getProgram(programId) {
    return request({
        url: API_BASE_URL + "/programs/" + programId,
        method: 'GET'
    });
}

export function saveProgram(saveProgramRequest) {
    return request({
        url: API_BASE_URL + "/programs",
        method: 'POST',
        body: JSON.stringify(saveProgramRequest)
    });
}