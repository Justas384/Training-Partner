import React from "react";
import {Form, Input, Table} from "antd";

import './EditableTable.css';

const editableContext = React.createContext();

const FormItem = Form.Item;

const editableRow = ({form, index, ...props}) => (
    <editableContext.Provider value={form}>
        <tr {...props} />
    </editableContext.Provider>
);

const editableFormRow = Form.create()(editableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };
    toggleEdit = () => {
        const editing = !this.state.editing;

        this.setState({editing}, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };
    handleClickOutside = (event) => {
        const {editing} = this.state;

        if (editing && this.cell !== event.target && !this.cell.contains(event.target)) {
            this.save();
        }
    };
    save = () => {
        const {record, handleSave} = this.props;

        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            this.toggleEdit();

            handleSave({...record, ...values});
        });
    };

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    render() {
        const {editing} = this.state;

        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;

        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <editableContext.Consumer>
                        {(form) => {
                            this.form = form;

                            return (
                                editing ? (
                                    <FormItem style={{margin: 0}}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input ref={node => (this.input = node)}
                                                   onPressEnter={this.save}/>
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="cell-value-wrap"
                                        onClick={this.toggleEdit}>

                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </editableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

export default class EditableTable extends React.Component {
    render() {
        const {dataSource} = this.props;

        // Prepare to override default table elements.

        const components = {
            body: {
                row: editableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.props.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.props.handleSave
                }),
            };
        });

        return (
            <Table components={components} // Overrides default table elements.
                   rowClassName={() => 'editable-row'}
                   bordered
                   pagination={false}
                   dataSource={dataSource}
                   columns={columns}/>
        );
    }
}