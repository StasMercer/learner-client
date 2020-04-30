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
                        label="Введіть ім'я"
                        placeholder="Ім'я"
                        name="firstName"
                        error={errors.firstName && !values.firstName ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        label="Введіть фамілію"
                        placeholder="Фамілія"
                        name="lastName"
                        error={errors.lastName && !values.lastName ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        label="Введіть email"
                        placeholder="email"
                        name="email"
                        error={errors.email && !values.email}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        type="password"
                        label="Введіть пароль"
                        placeholder="Пароль"
                        name="password"
                        error={errors.password && !values.password ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        type="password"
                        label="Підтвердіть пароль"
                        placeholder="Пароль"
                        name="confirmPassword"
                        error={errors.confirmPassword && !values.confirmPassword ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Group inline>
                    <label>Оберіть роль</label>
                    <Form.Field
                        control={Radio}
                        label="Учень"
                        name="role"
                        value="student"
                        checked={values.role === "student"}
                        onChange={onRoleChange}
                    />
                    <Form.Field
                        control={Radio}
                        label="Учитель"
                        name="role"
                        value="teacher"
                        checked={values.role === "teacher"}
                        onChange={onRoleChange}
                    />
                </Form.Group>

                <Button primary color="blue" type="submit">
                    Підтвердити
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
            id
            email
            createdAt
            token
            role
        }
    }
`;

export default Register;
