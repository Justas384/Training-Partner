export default class Message {
    static SUCCESS_SIGN_UP = 'You are successfully registered. Please login to continue!';
    static ERROR_DUPLICATE_USERNAME = 'Username is already taken.';
    static ERROR_DUPLICATE_EMAIL = 'Email is already registered.';
    static ERROR_LOGIN_CREDENTIALS = 'Your username or password is incorrect. Please try again!';
    static ERROR_UNDEFINED = 'Sorry, something went wrong. Please try again!';
    static ERROR_DUPLICATE_PROGRAM_TITLE = 'You already have such titled program.';

    static success = (item, action) => {
        return `${item} successfully ${action}!`;
    };

    static errorLoading = item => {
        return `${item} could not be loaded.`;
    };

    static errorLength = (item, type, length) => {
        return `${item} is too ${type} (${type === 'short' ? 'minimum' : 'maximum'} ${length} symbols ${type === 'short' ? 'needed' : 'allowed.'})`;
    };

    static errorEmpty = item => {
        return `${item} should not be empty.`;
    };

    static errorValidity = item => {
        return `${item} is not valid.`;
    };

    static errorInput(item) {
        return `Please input ${item}!`;
    };
}