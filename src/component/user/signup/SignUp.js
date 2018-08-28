import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Form, Input, notification} from 'antd';

import './SignUp.css';
import {
    EMAIL_MAX_LENGTH,
    NAME_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH
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
        this.isFormInvalid = this.isFormInvalid.bind(this);
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
                    description: "You are successfully registered. Please login to continue!",
                });

                this.props.history.push("/login");
            }).catch(error => {
            notification.error({
                message: 'Training Partner',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(
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
                                    disabled={this.isFormInvalid()}>Sign Up</Button>
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
                errorMsg: `Name is too long (maximum ${NAME_MAX_LENGTH} characters allowed)`
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
                errorMsg: `Username is too short (minimum ${USERNAME_MIN_LENGTH} symbols needed)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (maximum ${USERNAME_MAX_LENGTH} symbols allowed)`
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
                            errorMsg: 'Username is already taken!'
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
                            errorMsg: 'Email is already registered'
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
                errorMsg: 'Email should not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');

        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (maximum ${EMAIL_MAX_LENGTH} symbols allowed)`
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
                errorMsg: `Password is too short (minimum ${PASSWORD_MIN_LENGTH} symbols needed)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (maximum ${PASSWORD_MAX_LENGTH} symbols allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }
}