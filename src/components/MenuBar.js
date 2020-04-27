import React, { useContext } from "react";
import {Icon, Menu} from "semantic-ui-react";
import { useState } from "react";
import { Link, withRouter } from "react-router-dom";


import { AuthContext } from "../context/auth";
import UserMenu from "./UserMenu";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_CONTENT, REMOVE_CONTENT} from "../utils/graphql";

function MenuBar(props) {
    const { user, logout } = useContext(AuthContext);

    let path = window.location.pathname;
    path = path === "/" ? "home" : path.substr(1);
    const {data, refetch} = useQuery(GET_CONTENT);
    const [removeContent] = useMutation(REMOVE_CONTENT);
    const [itemName, setItemName] = useState(path);
    const handleItemClick = (e, { name }) => {
        setItemName(name);
    };
    if(!data) return null;
    const userAction = user ? (
        <Menu.Menu position="right">

            <UserMenu  context={{ user, logout }} />

        </Menu.Menu>
    ) : (
        <Menu.Menu position="right">

            <Menu.Item
                name="register"
                active={itemName === "register"}
                onClick={handleItemClick}
                as={Link}
                to="/register"
            >
                Реєстрація
            </Menu.Item>
            <Menu.Item
                name="login"
                active={itemName === "login"}
                onClick={handleItemClick}
                as={Link}
                to="/login"
            >
                Увійти
            </Menu.Item>
        </Menu.Menu>
    );

    return (
        <Menu size="massive" pointing secondary stackable color="blue">
            <Menu.Item
                name="home"
                active={itemName === "home"}
                onClick={handleItemClick}
                as={Link}
                to="/"
            >
                <Icon name={"leaf"} />
                Learner
            </Menu.Item>

            <Menu.Item
                name="cyclecourses"
                active={itemName === "cyclecourses"}
                onClick={handleItemClick}
                as={Link}
                to="/cyclecourses"
            >
                Цикли курсів
            </Menu.Item>

            <Menu.Item
                name="courses"
                active={itemName === "courses"}
                onClick={handleItemClick}
                as={Link}
                to="/courses"
            >
                Курси
            </Menu.Item>
            <Menu.Item
                name="about"
                active={itemName === "about"}
                onClick={handleItemClick}
                as={Link}
                to="/about"
            >
                Про ресурс
            </Menu.Item>
            {data.getAdminContent.map(cont => {
                if(cont.contentName === 'home') return null;
                if(cont.contentName === 'about') return null;
                return(<Menu.Item
                    name={cont.contentName}
                    key={cont.id}
                    active={itemName === cont.contentName}
                    onClick={handleItemClick}
                    as={Link}
                    to={"/content/" + cont.contentName + '/' + cont.id}
                >
                    {cont.contentName}
                    {user && user.role === 'admin' && (<Icon name={"trash"} onClick={() => {
                        removeContent({variables: {contentId: cont.id}}).then(() => {
                            refetch().then(() => {
                                props.history.push('/')
                            });

                        })
                    }} link/>)}

                </Menu.Item>)


            })}
            <Menu.Menu position="right">{userAction}</Menu.Menu>
        </Menu>
    );
}
export default withRouter(MenuBar);