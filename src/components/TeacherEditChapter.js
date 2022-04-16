import React, { useEffect, useState } from 'react';
import { Button, Container, Embed, Form, List } from 'semantic-ui-react';
import TeacherEditTest from './TeacherEditTest';
import { useForm } from '../utils/hooks';
import firebase from '../utils/firebase';
import 'firebase/storage';
import {useApolloClient, useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GET_COURSE } from '../utils/graphql';

function TeacherEditChapter(props) {
    const { onChange, onSubmit, values, setValues } = useForm(
        () => updateCallback(),
        {
            chapterName: '',
            text: '',
            media: '',
            type: '',
        }
    );
    const client = useApolloClient();
    console.log(client);
    useEffect(() => {
        if (props.chapter) {
            setValues({
                chapterName: props.chapter.chapterName,
                text: props.chapter.text,
                media: props.chapter.media,
                type: props.chapter.type,
            });
        }
    }, [props, setValues]);
    const [updateChapter] = useMutation(UPDATE_CHAPTER, {
        update(proxy, { data: { updateChapter } }) {
            try {
                const data = proxy.readQuery({
                    query: GET_COURSE,
                    variables: { courseId: props.courseId },
                });

                data.getCourse.chapters[props.chapterIndex].media =
                    updateChapter.chapters[props.chapterIndex].media;
                data.getCourse.chapters[props.chapterIndex].chapterName =
                    updateChapter.chapters[props.chapterIndex].chapterName;
                data.getCourse.chapters[props.chapterIndex].text =
                    updateChapter.chapters[props.chapterIndex].text;

                proxy.writeQuery({ query: GET_COURSE, data });
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        },
        onError(err) {
            console.log(err);
            setLoading(false);
        },
        variables: {
            courseId: props.courseId,
            chapterIndex: props.chapterIndex,
            chapterName: values.chapterName,
            text: values.text,
            media: values.media,
            type: values.type,
        },
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    function updateCallback() {
        if (file) {
            setLoading(true);
            let filetype = file.name.split('.').pop();
            let folder = 'files/';
            switch (filetype) {
                case 'mp4':
                    folder = 'videos/';
                    break;
                case 'pdf':
                    folder = 'files/';
                    break;
                default: break;
            }

            firebase
                .storage()
                .ref()
                .child(folder + file.name)
                .put(file)
                .then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((downloadUrl) => {
                        values.media = downloadUrl;
                        setValues({ ...values });
                        updateChapter();
                    });
                });
        }

        if (values) {
            updateChapter();
        }
    }

    const [addTest] = useMutation(ADD_TEST, {
        update(proxy, { data: { addTestToCourse: test } }) {
            try {
                const data = proxy.readQuery({
                    query: GET_COURSE,
                    variables: { courseId: props.courseId },
                });
                data.getCourse.chapters[props.chapterIndex].tests.push(test);
                proxy.writeQuery({ query: GET_COURSE, data });
            } catch (e) {
                console.log(e);
            }
        },
        onError(err) {
            console.log(err);
        },
        variables: {
            question: 'New test ' + (props.chapter && (props.chapter.tests.length + 1)),
            courseId: props.courseId,
            chapterIndex: props.chapterIndex,
            variants: ['a', 'b'],
            answer: [0]
        },
    });

    if (!props.chapter) {
        return null;
    }

    return (
        <Container>
            <Form onSubmit={onSubmit}>
                <Form.Input
                    onChange={onChange}
                    name={'chapterName'}
                    value={values.chapterName}
                />

                {values.media && props.chapter.type != 'test' &&<Embed icon="play" url={values.media} />}
                
                {props.chapter.type == 'lecture' && (
                    <Form.Input
                    onChange={(event) => {
                        setFile(event.target.files[0]);
                    }}
                    name="media"
                    type="file"
                    text="New media"
                    accept=".mp4, .pdf"
                />
                )}
                

                <Form.TextArea
                    style={{
                        fontSize: '1.5em',
                        lineHeight: '1.5em',
                        textAlign: 'justify',
                    }}
                    onChange={onChange}
                    name="text"
                    value={values.text}
                />

                <Button
                    loading={loading}
                    type={'submit'}
                    style={{ marginBottom: '10px' }}
                    primary
                >
                    Update all
                </Button>
            </Form>
            {props.chapter.tests.length > 0 && (
                <div>
                    {props.chapter.tests.map((test, testIndex) => (
                        <List key={testIndex}>
                            <TeacherEditTest
                                courseId={props.courseId}
                                chapterIndex={props.chapterIndex}
                                testIndex={testIndex}
                                test={test}
                            />
                        </List>
                    ))}
                </div>
            )}
            {(values.type === 'test' || values.type === 'control') && (
                <Button secondary onClick={addTest}>
                    Add test
                </Button>
            )}
        </Container>
    );
}

const ADD_TEST = gql`
    mutation addTest($courseId: ID!, $chapterIndex: Int!, $question: String!, $variants: [String], $answer: [Int]) {
        addTestToCourse(
            courseId: $courseId
            chapterIndex: $chapterIndex
            test: { question: $question variants: $variants answer: $answer}
        ) {
            answer
            question
            variants
        }
    }
`;

const UPDATE_CHAPTER = gql`
    mutation updateChapter(
        $courseId: ID!
        $chapterIndex: Int!
        $text: String!
        $chapterName: String!
        $media: String
        $type: String!
    ) {
        updateChapter(
            chapterIndex: $chapterIndex
            text: $text
            courseId: $courseId
            chapterName: $chapterName
            media: $media
            type: $type
        ) {
            chapters {
                chapterName
                media
                text
            }
        }
    }
`;

export default TeacherEditChapter;
