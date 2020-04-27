import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Home from "./pages/Home";
import CycleCourses from "./pages/CycleCourses";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MenuBar from "./components/MenuBar";
import {AuthProvider} from './context/auth'
import Course from './pages/Course'
import AuthRoute from "./utils/AuthRoute";
import CreateCourse from "./pages/CreateCourse";
import PageNotFound from "./pages/PageNotFound";
import Content from "./components/Content";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Container>
                    <MenuBar/>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route
                            exact
                            path="/cyclecourses"
                            component={CycleCourses}
                        />
                        <Route path={'/course/:courseId'} component={Course}/>
                        <Route exact path="/courses" component={Courses} />
                        <Route exact path="/about" component={About} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <AuthRoute exact path="/createcourse" component={CreateCourse} />
                        <Route path={'/content/:contentName/:contentId'} component={Content}/>
                        <Route component={PageNotFound} />
                    </Switch>

                </Container>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
