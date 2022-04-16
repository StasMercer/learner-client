import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
    ADD_ADMIN_MESSAGE,
    GET_CONTENT_BY_ID,
    REMOVE_ADMIN_MESSAGE,
} from '../utils/graphql';
import PageNotFound from '../pages/PageNotFound';
import moment from 'moment';
import 'moment/locale/uk';
import {
    Button,
    Container,
    Form,
    Icon,
    Loader,
    Segment,
} from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

function Content(props) {
    let { contentName, contentId } = useParams();
    const { data, error, loading } = useQuery(GET_CONTENT_BY_ID, {
        variables: { contentId: contentId || props.contentId },
    });
    const { user } = useContext(AuthContext);
    const { onChange, onSubmit, values } = useForm(() => addMessage(), {
        messageHeader: '',
        messageText: '',
    });

    const [addMessage] = useMutation(ADD_ADMIN_MESSAGE, {
        update(
            proxy,
            {
                data: {
                    addMessage: { messages },
                },
            }
        ) {
            try {
                const data = proxy.readQuery({
                    query: GET_CONTENT_BY_ID,
                    variables: { contentId },
                });
                data.getAdminContentById.messages = messages;
                proxy.writeQuery({ query: GET_CONTENT_BY_ID, data });
            } catch (e) {
                console.log(e);
            }
        },
        onError(e) {
            console.log(e);
        },
        variables: {
            ...values,
            contentId: contentId || props.contentId,
        },
    });

    const [removeMessage] = useMutation(REMOVE_ADMIN_MESSAGE, {
        update(
            proxy,
            {
                data: {
                    removeMessage: { messages },
                },
            }
        ) {
            try {
                const data = proxy.readQuery({
                    query: GET_CONTENT_BY_ID,
                    variables: { contentId: contentId || props.contentId },
                });
                data.getAdminContentById.messages = messages;
                proxy.writeQuery({ query: GET_CONTENT_BY_ID, data });
            } catch (e) {
                console.log(e);
            }
        },
        onError(e) {
            console.log(e);
        },
    });
    if (!contentId) contentId = props.contentId;
    if (error) {
        return <PageNotFound />;
    }
    if (loading) {
        return <Loader active inline="centered" />;
    }
    if (
        data.getAdminContentById.contentName !== 'home' &&
        data.getAdminContentById.contentName !== 'about'
    ) {
        if (data.getAdminContentById.contentName !== contentName) {
            console.log('no way');
            return <PageNotFound />;
        }
    }

    const messages = data.getAdminContentById.messages;

    return (
        <div>
            {messages &&
                messages.map((msg, messageIndex) => (
                    <Segment key={msg.createdAt}>
                        {user && user.role === 'admin' && (
                            <Icon
                                name={'trash'}
                                link
                                onClick={() => {
                                    removeMessage({
                                        variables: {
                                            messageIndex,
                                            contentId:
                                                contentId || props.contentId,
                                        },
                                    });
                                }}
                            />
                        )}
                        <h2>{msg.messageHeader}</h2>
                        <Container>{msg.messageText}</Container>
                        {moment(msg.createdAt).format('LL')}
                    </Segment>
                ))}
            {user && user.role === 'admin' && (
                <Form onSubmit={onSubmit}>
                    <Form.Input
                        onChange={onChange}
                        name={'messageHeader'}
                        value={values.messageHeader}
                        placeholder={'Add message'}
                    />
                    <Form.TextArea
                        onChange={onChange}
                        name={'messageText'}
                        value={values.messageText}
                        placeholder={'Add message text'}
                    />
                    <Button primary type={'submit'}>
                        Add
                    </Button>
                </Form>
            )}
        </div>
    );
}

export default Content;
