import React, {Component} from 'react';
import {Button, Form, Icon, Input, notification} from 'antd';

import './ProgramNew.css';
import EditableTable from "../../common/EditableTable";
import {checkProgramTitleAvailability, saveProgram} from "../../utility/APIUtilities";
import {PROGRAM_TITLE_MAX_LENGTH, PROGRAM_TITLE_MIN_LENGTH} from "../../constants";

const FormItem = Form.Item;

export default class ProgramNew extends Component {
    handleAdd = () => {
        const {count, exercises} = this.state;

        const newData = {
            key: count,
            day: 0,
            exercise: 'New exercise',
            series: 0,
            repeatsSerie: 0
        };

        this.setState({
            exercises: [...exercises, newData],

            count: count + 1,
        });
    };
    handleSave = (row) => {
        const newData = [...this.state.exercises];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];

        newData.splice(index, 1, {
            ...item,
            ...row,
        });

        this.setState({exercises: newData});
    };
    handleDelete = (key) => {
        const exercises = [...this.state.exercises];

        this.setState({exercises: exercises.filter(item => item.key !== key)});
    };
    validateProgramTitle = (programTitle) => {
        if (programTitle.length < PROGRAM_TITLE_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Program title is too short (minimum ${PROGRAM_TITLE_MIN_LENGTH} symbols needed)`
            }
        } else if (programTitle.length > PROGRAM_TITLE_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Program title is too long (maximum ${PROGRAM_TITLE_MAX_LENGTH} symbols allowed)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            programTitle: {
                value: ''
            },
            exercises: [
                {
                    key: 0,
                    day: 0,
                    exercise: 'New exercise',
                    series: 0,
                    repeatsSerie: 0
                }
            ],
            count: 1
        };

        this.columns = [{
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
            editable: true
        }, {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
            editable: true
        }, {
            title: 'Series',
            dataIndex: 'series',
            key: 'series',
            editable: true
        }, {
            title: 'Repeats per Serie',
            dataIndex: 'repeatsSerie',
            key: 'repeatsSerie',
            editable: true
        }, {
            title: 'Total Repeats',
            dataIndex: 'totalRepeats',
            key: 'totalRepeats',
            render: (text, record) => {
                const totalRepeats = record.series * record.repeatsSerie;

                return (
                    totalRepeats > 0 ?
                        (
                            totalRepeats
                        ) : 0
                );
            }
        }, {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    this.state.exercises.length > 1 ?
                        (
                            <a onClick={() => this.handleDelete(record.key)}>Delete</a>
                        ) : null
                );
            }
        }];

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateProgramTitleAvailability = this.validateProgramTitleAvailability.bind(this);
        this.isProgramTitleValid = this.isProgramTitleValid.bind(this);
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

        const saveProgramRequest = {
            programTitle: this.state.programTitle.value,
            exercises: this.state.exercises
        };

        saveProgram(saveProgramRequest)
            .then(response => {
                notification.success({
                    message: 'Training Partner',
                    description: "Program successfully saved!",
                });

                this.props.history.push("/trainings/new");
            }).catch(error => {
            notification.error({
                message: 'Training Partner',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    validateProgramTitleAvailability() {
        const programTitle = this.state.programTitle.value;
        const programTitleValidation = this.validateProgramTitle(programTitle);

        if (programTitleValidation.validateStatus === 'error') {
            this.setState({
                programTitle: {
                    value: programTitle,
                    ...programTitleValidation
                }
            });

            return;
        }

        this.setState({
            programTitle: {
                value: programTitle,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkProgramTitleAvailability(programTitle)
            .then(response => {
                if (response.available) {
                    this.setState({
                        programTitle: {
                            value: programTitle,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        programTitle: {
                            value: programTitle,
                            validateStatus: 'error',
                            errorMsg: 'You already have such titled program'
                        }
                    });
                }
            }).catch(error => {
            this.setState({
                programTitle: {
                    value: programTitle,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    };

    isProgramTitleValid() {
        return this.state.programTitle.validateStatus === 'success';
    }

    render() {
        return (
            <div className="program-new-container">
                <h1 className="page-title">New Program</h1>

                <div className="program-new-content">
                    <Form>
                        <FormItem label="Program title:"
                                  colon={false}
                                  validateStatus={this.state.programTitle.validateStatus}
                                  help={this.state.programTitle.errorMsg}>

                            <Input name="programTitle"
                                   autoComplete="off"
                                   value={this.state.programTitle.value}
                                   onBlur={this.validateProgramTitleAvailability}
                                   onChange={(event) => this.handleInputChange(event, this.validateProgramTitle)}/>
                        </FormItem>
                    </Form>

                    <div className="program-new-row">
                        <EditableTable dataSource={this.state.exercises}
                                       columns={this.columns}
                                       handleSave={this.handleSave}
                                       handleDelete={this.handleDelete}/>
                    </div>

                    <Button className="program-new-row" type="dashed" onClick={this.handleAdd}>
                        <Icon type="plus"/> Add an exercise
                    </Button>

                    <Button type="primary"
                            onClick={this.handleSubmit}
                            size="large"
                            className="program-new-primary-button"
                            disabled={!this.isProgramTitleValid()}>
                        Add
                    </Button>
                </div>
            </div>
        );
    }
}