import React, { useState, useContext } from "react";
import { Form, Radio, Button } from "semantic-ui-react";
import gql  from "graphql-tag";
import {useMutation} from '@apollo/react-hooks'

import { useForm } from "../utils/hooks";
import MessageError from '../components/MessageError'
import {AuthContext} from '../context/auth'

function Register(props) {

    const context = useContext(AuthContext);

    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, setValues, values } = useForm(() => addUser(), {
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        confirmPassword: "",
        role: "student",
    });

    function onRoleChange(e, { value }) {
        setValues({ ...values, role: value });
    }

    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}){
            console.log(userData);
            
            context.login(userData);
            props.history.push('/');
        },
        onError(err){
            
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    })

    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate loading={loading ? true: false}>
                <Form.Field>
                    <Form.Input
                        label="Name"
                        placeholder="John"
                        name="firstName"
                        error={errors.firstName && !values.firstName ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        label="Surname"
                        placeholder="Doe"
                        name="lastName"
                        error={errors.lastName && !values.lastName ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        label="Email"
                        placeholder="john.doe@gmail.com"
                        name="email"
                        error={errors.email && !values.email}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        type="password"
                        label="Enter the password"
                        placeholder="password"
                        name="password"
                        error={errors.password && !values.password ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        type="password"
                        label="Confirm password"
                        placeholder="Password"
                        name="confirmPassword"
                        error={errors.confirmPassword && !values.confirmPassword ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Group inline>
                    <label>Choose role</label>
                    <Form.Field
                        control={Radio}
                        label="Student"
                        name="role"
                        value="student"
                        checked={values.role === "student"}
                        onChange={onRoleChange}
                    />
                    <Form.Field
                        control={Radio}
                        label="Teacher"
                        name="role"
                        value="teacher"
                        checked={values.role === "teacher"}
                        onChange={onRoleChange}
                    />
                </Form.Group>

                <Button primary color="blue" type="submit">
                    Confirm
                </Button>
            </Form>
            <MessageError errors={errors}/>
        </div>
    );
}

const REGISTER_USER = gql`
    mutation register(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
        $role: String!
    ) {
        register(registerInput: {firstName: $firstName, lastName:$lastName, email: $email, password:$password, confirmPassword:$confirmPassword, role: $role}){
            firstName
            lastName
            id
            email
            createdAt
            token
            role
        }
    }
`;

export default Register;
