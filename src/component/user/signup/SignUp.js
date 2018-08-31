import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Form, Input, notification} from 'antd';

import './SignUp.css';
import {
    EMAIL_MAX_LENGTH,
    ERROR_DUPLICATE_EMAIL,
    ERROR_DUPLICATE_USERNAME,
    error_empty,
    error_length,
    ERROR_UNDEFINED,
    error_validity,
    NAME_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    SUCCESS_SIGN_UP,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
} from '../../../constants';
import {checkEmailAvailability, checkUsernameAvailability, signup} from '../../../utility/APIUtilities';

const FormItem = Form.Item;

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
    }

    handleInputChange(event, validationFunction) {
        const target = event.target;

        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFunction(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const signupRequest = {
            name: this.state.name.value,
            username: this.state.username.value,
            email: this.state.email.value,
            password: this.state.password.value
        };

        signup(signupRequest)
            .then(response => {
                notification.success({
                    message: 'Training Partner',
                    description: SUCCESS_SIGN_UP
                });

                this.props.history.push("/login");
            }).catch(error => {
            notification.error({
                message: 'Training Partner',
                description: error.message || ERROR_UNDEFINED
            });
        });
    }

    isFormValid() {
        return (
            this.state.name.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>

                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            label="Name:"
                            colon={false}
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>

                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Your name"
                                value={this.state.name.value}
                                onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                        </FormItem>

                        <FormItem label="Username:"
                                  colon={false}
                                  hasFeedback
                                  validateStatus={this.state.username.validateStatus}
                                  help={this.state.username.errorMsg}>

                            <Input
                                size="large"
                                name="username"
                                autoComplete="off"
                                placeholder="A unique username"
                                value={this.state.username.value}
                                onBlur={this.validateUsernameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateUsername)}/>
                        </FormItem>

                        <FormItem
                            label="Email:"
                            colon={false}
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>

                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                placeholder="Your email"
                                value={this.state.email.value}
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)}/>
                        </FormItem>

                        <FormItem
                            label="Password:"
                            colon={false}
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>

                            <Input
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder="A password between 6 to 20 symbols"
                                value={this.state.password.value}
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)}/>
                        </FormItem>

                        <FormItem>
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="signup-form-button"
                                    disabled={!this.isFormValid()}
                            >
                                Sign Up
                            </Button>
                            Already registered? <Link to="/login">Login now!</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation functions.

    validateName = (name) => {
        if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: error_length('Name', 'long', NAME_MAX_LENGTH)
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: error_length('Username', 'short', USERNAME_MIN_LENGTH)
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: error_length('Username', 'long', USERNAME_MAX_LENGTH)
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    };

    validateUsernameAvailability() {
        const username = this.state.username.value;
        const usernameValidation = this.validateUsername(username);

        if (usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: username,
                    ...usernameValidation
                }
            });

            return;
        }

        this.setState({
            username: {
                value: username,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(username)
            .then(response => {
                if (response.available) {
                    this.setState({
                        username: {
                            value: username,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: username,
                            validateStatus: 'error',
                            errorMsg: ERROR_DUPLICATE_USERNAME
                        }
                    });
                }
            }).catch(error => {
            this.setState({
                username: {
                    value: username,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        const email = this.state.email.value;
        const emailValidation = this.validateEmail(email);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: email,
                    ...emailValidation
                }
            });

            return;
        }

        this.setState({
            email: {
                value: email,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(email)
            .then(response => {
                if (response.available) {
                    this.setState({
                        email: {
                            value: email,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: email,
                            validateStatus: 'error',
                            errorMsg: ERROR_DUPLICATE_EMAIL
                        }
                    });
                }
            }).catch(error => {
            this.setState({
                email: {
                    value: email,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: error_empty('Email')
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');

        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: error_validity('Email')
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: error_length('Email', 'long', EMAIL_MAX_LENGTH)
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    };

    validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: error_length('Password', 'short', PASSWORD_MIN_LENGTH)
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: error_length('Password', 'long', PASSWORD_MAX_LENGTH)
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }
}