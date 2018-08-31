export const API_BASE_URL = 'http://localhost:8080/api';
export const ACCESS_TOKEN = 'accessToken';

export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const PROGRAM_TITLE_MIN_LENGTH = 3;
export const PROGRAM_TITLE_MAX_LENGTH = 15;

// Messages and functions to build messages.

export function success(item, action) {
    return `${item} successfully ${action}!`;
}

export function error_loading(item) {
    return `${item} could not be loaded`;
}

export function error_length(item, type, length) {
    return `${item} is too ${type} (${type === 'short' ? 'minimum' : 'maximum'} ${length} symbols ${type === 'short' ? 'needed' : 'allowed'})`;
}

export function error_empty(item) {
    return `${item} should not be empty`;
}

export function error_validity(item) {
    return `${item} not valid`;
}

export function error_input(item) {
    return `Please input ${item}!`;
}

export const SUCCESS_SIGN_UP = 'You are successfully registered. Please login to continue!';
export const ERROR_DUPLICATE_USERNAME = 'Username is already taken';
export const ERROR_DUPLICATE_EMAIL = 'Email is already registered';
export const ERROR_LOGIN_CREDENTIALS = 'Your username or password is incorrect. Please try again!';
export const ERROR_UNDEFINED = 'Sorry, something went wrong. Please try again!';
export const ERROR_DUPLICATE_PROGRAM_TITLE = 'You already have such titled program';