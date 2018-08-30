import React, {Component} from 'react';
import {Button, Form, Icon, Input, notification} from 'antd';

import './ProgramEdit.css';
import EditableTable from "../../common/EditableTable";
import {checkProgramTitleAvailability, getProgram, saveProgram} from "../../utility/APIUtilities";
import {PROGRAM_TITLE_MAX_LENGTH, PROGRAM_TITLE_MIN_LENGTH} from "../../constants";

const FormItem = Form.Item;

export default class ProgramEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            programTitle: {
                value: ''
            },
            exercises: [{
                key: 0,
                id: 0,
                day: 0,
                exercise: 'New exercise',
                series: 0,
                repeatsSerie: 0
            }],
            count: 1
        };

        this.programId = props.location.state !== undefined ? props.location.state.programId : 0;

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

    initializeExercise = () => {
        const {exercises, count} = this.state;

        const exercise = {
            key: count,
            id: 0,
            day: 0,
            exercise: 'New exercise',
            series: 0,
            repeatsSerie: 0
        };

        this.setState({
            exercises: [...exercises, exercise],
            count: count + 1
        });
    };

    loadProgram = () => {
        getProgram(this.programId)
            .then(response => {
                let {count} = this.state;
                let exercises = response.exercises.map(exercise => {
                    return {
                        key: count++,
                        ...exercise
                    };
                });

                this.setState({
                    programTitle: {
                        value: response.programTitle,
                        validateStatus: 'success'
                    },
                    exercises,
                    count
                });
            }).catch(error => {
            notification.error({
                message: 'Training Partner',
                description: error.message || 'Program could not be loaded'
            });
        });
    };

    componentWillMount() {
        if (this.programId) this.loadProgram();
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

        const {programTitle, exercises} = this.state;

        const saveProgramRequest = {
            id: this.programId,
            programTitle: programTitle.value,
            exercises,
        };

        saveProgram(saveProgramRequest)
            .then(response => {
                notification.success({
                    message: 'Training Partner',
                    description: "Program successfully saved!",
                });

                this.props.history.goBack();
            }).catch(error => {
            notification.error({
                message: 'Training Partner',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    handleSave = row => {
        const newData = [...this.state.exercises];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];

        newData.splice(index, 1, {
            ...item,
            ...row,
        });

        this.setState({exercises: newData});
    };

    handleDelete = key => {
        const exercises = [...this.state.exercises];

        this.setState({exercises: exercises.filter(item => item.key !== key)});
    };

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

        checkProgramTitleAvailability(programTitle, this.programId)
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

    isProgramTitleValid() {
        return this.state.programTitle.validateStatus === 'success';
    }

    // Render functions.

    renderPageTitle = () => {
        return !this.programId ? 'New program' : 'Edit program';
    };

    render() {
        const {programTitle, exercises} = this.state;

        return (
            <div className="program-new-container">
                <h1 className="page-title">{this.renderPageTitle()}</h1>

                <div className="program-new-content">
                    <Form>
                        <FormItem label="Program title:"
                                  colon={false}
                                  validateStatus={programTitle.validateStatus}
                                  help={programTitle.errorMsg}>

                            <Input name="programTitle"
                                   autoComplete="off"
                                   value={programTitle.value}
                                   onBlur={this.validateProgramTitleAvailability}
                                   onChange={(event) => this.handleInputChange(event, this.validateProgramTitle)}/>
                        </FormItem>
                    </Form>

                    <div className="program-new-row">
                        <EditableTable dataSource={exercises}
                                       columns={this.columns}
                                       handleSave={this.handleSave}
                                       handleDelete={this.handleDelete}/>
                    </div>

                    <Button className="program-new-row" type="dashed" onClick={this.initializeExercise}>
                        <Icon type="plus"/> Add an exercise
                    </Button>

                    <Button type="primary"
                            onClick={this.handleSubmit}
                            size="large"
                            className="program-new-primary-button"
                            disabled={!this.isProgramTitleValid()}>
                        Save
                    </Button>
                </div>
            </div>
        );
    }
}