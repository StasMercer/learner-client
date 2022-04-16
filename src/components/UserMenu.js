import React from "react";
import {Dropdown, Label} from "semantic-ui-react";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {Link, withRouter} from "react-router-dom";
import RemoveUserFromCourse from "./RemoverUserFromCourse";
import AddAdminContent from "./AddAdminContent";
import {GET_USER_PROGRESS} from "../utils/graphql";

function UserMenu(props) {
    const { data, client } = useQuery(GET_USER_PROGRESS, {});

    return (
        <Dropdown
            text={props.context.user.firstName}
            icon={'user'}
            pointing
            item

        >
            <Dropdown.Menu>
                <Dropdown.Header content="Your courses:"/>

                {data &&
                data.getUser.progress.map((course) => (
                    <Dropdown.Item

                        key={course.courseId}
                    >
                        <Label size='large' color='violet' as={Link}
                           to={'/course/' + course.courseId}> {course.courseName}</Label>
                        <RemoveUserFromCourse courseId={course.courseId}/>

                    </Dropdown.Item>
                ))}
                <Dropdown.Divider/>
                {data && data.getUser.role === 'teacher' && (
                    <Dropdown.Item
                        icon="plus"
                        text="New course"
                        as={Link}
                        to={"/createcourse"}
                    />
                )}

                {data && data.getUser.role === 'admin' && (
                        <AddAdminContent />
                )}
                <Dropdown.Item
                    icon="sign-out"
                    text="Exit"
                    onClick={() => {
                        client.cache.reset().then(() => {
                            props.context.logout();
                            props.history.push('/');
                        });

                    }}
                />
            </Dropdown.Menu>
        </Dropdown>
    );
}



export default withRouter(UserMenu);
