import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";
import MessageError from "../components/MessageError";

function Login(props) {
    const context = useContext(AuthContext);

    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(() => loginUser(), {
        password: "",
        email: "",
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }) {

            context.login(userData);
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    return (
        <div className="form-container">
            <Form
                onSubmit={onSubmit}
                noValidate
                loading={loading ? true : false}
            >
                <Form.Field>
                    <Form.Input
                        label="Введіть email"
                        placeholder="Email"
                        name="email"
                        error={errors.email && !values.email ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        label="Введіть пароль"
                        placeholder="Пароль"
                        name="password"
                        type={"password"}
                        error={
                            errors.password && !values.password ? true : false
                        }
                        onChange={onChange}
                    />
                </Form.Field>
                <Button primary color="blue" type="submit">
                    Підтвердити
                </Button>
            </Form>
            <MessageError errors={errors} />
        </div>
    );
}

const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
            firstName
            lastName
            token
            role
        }
    }
`;

export default Login;
