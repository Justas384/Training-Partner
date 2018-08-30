import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';

import {ACCESS_TOKEN} from '../constants/index';
import './App.css';
import {getCurrentUser} from '../utility/APIUtilities';

import SignUp from '../component/user/signup/SignUp';
import Login from '../component/user/login/Login';
import ProgramEdit from '../component/program/ProgramEdit';

import {Layout, notification} from 'antd';
import Diary from "../component/diary/Diary";
import AppHeader from "../common/AppHeader";
import LoadingIndicator from "../common/LoadingIndicator";

const {Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    componentWillMount() {
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });

        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    handleLogout(redirectTo = "/", notificationType = "success", description = "You are successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'Training Partner',
            description: description,
        });
    }

    handleLogin() {
        notification.success({
            message: 'Training Partner',
            description: "You are successfully logged in.",
        });

        this.loadCurrentUser();
        this.props.history.push("/");
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }

        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route path="/signup" component={SignUp}/>
                            <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                            <Route path="/programs/edit" component={ProgramEdit}/>
                            <Route path={"/"} component={Diary}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);