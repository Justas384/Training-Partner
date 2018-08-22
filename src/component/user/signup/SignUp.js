import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Form, Input, Button, notification} from 'antd';

import './SignUp.css';
import {USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH} from '../../../constants';
import {signup, checkUsernameAvailability} from '../../../utility/APIUtilities';

const FormItem = Form.Item;

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: {
                value: ''
            },
            password: {
                value: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
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
            username: this.state.username.value,
            password: this.state.password.value
        };

        signup(signupRequest)
            .then(response => {
                notification.success({
                    message: 'Training Partner',
                    description: "Thank you! You are successfully registered. Please login to continue!",
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
            this.state.username.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>

                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem label="Username:"
                                  colon={false}
                                  hasFeedback
                                  validateStatus={this.state.username.validateStatus}
                                  help={this.state.username.errorMsg}>

                            <Input
                                size="large"
                                name="username"
                                autoComplete="off"
                                value={this.state.username.value}
                                onBlur={this.validateUsernameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateUsername)}/>
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