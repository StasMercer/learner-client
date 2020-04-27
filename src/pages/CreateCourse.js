import React, {useState} from 'react';
import {Button, Container, Form, Loader} from 'semantic-ui-react';
import {useForm} from "../utils/hooks";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag/src";
import MessageError from "../components/MessageError";
import {withRouter} from 'react-router-dom'
import {GET_USER_PROGRESS} from "../utils/graphql";

function CreateCourse(props) {

    const [errors, setErrors] = useState({});
    const {onChange, onSubmit, values} = useForm(courseCallback, {
        courseName:'',
        description: ''
    })

    const [createCourse, {loading}] = useMutation(CREATE_COURSE, {
        update(proxy, {data: {createCourse: {progress}}}){
            try{
                const data = proxy.readQuery({
                    query: GET_USER_PROGRESS
                });
                data.getUser.progress = progress;

                proxy.writeQuery({query: GET_USER_PROGRESS, data});
                const index = progress.findIndex((elem)=>elem.courseName === values.courseName);
                props.history.push("/course/"+progress[index].courseId);
            }catch (e) {
                console.log(e)
            }
        },
        onError(err){
            if(err.graphQLErrors[0].extensions.errors){
                setErrors(err.graphQLErrors[0].extensions.errors);
            }else{
                console.log(err)
            }
        },
        variables: values
    });
    if(loading) return <Loader active inline="centered" />;

    function courseCallback() {
        createCourse()
    }
    return (
        <Container>
            <Form onSubmit={onSubmit}>
                <Form.Input
                    label={'Введіть назву курсу'}
                    placeholder={'Назва курсу. 100 символів максимум'}
                    onChange={onChange}
                    name="courseName"
                />
                <Form.TextArea
                    label={'Введіть опис курсу'}
                    placeholder={
                        'Опишіть чому можна навчитись у вашому курсі. 300 символів максимум'
                    }
                    onChange={onChange}
                    name="description"
                />
                <Button type="submit" primary>Підтвердити</Button>
            </Form>
            {errors && <MessageError errors={errors} />}

        </Container>

    );
}


const CREATE_COURSE = gql`
    mutation createCourse($courseName: String!, $description: String!){
        createCourse(courseName: $courseName, description: $description){
            id
            progress{
                chapters{
                    wasMade
                }
                courseId
                courseName
            }
        }
    }
`;

export default withRouter(CreateCourse);
