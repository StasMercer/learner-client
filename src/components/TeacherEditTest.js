import React, {useEffect, useState} from 'react';
import { Button,  Form,  List, Segment } from 'semantic-ui-react';
import { useForm } from '../utils/hooks';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag/src';
import {GET_COURSE} from "../utils/graphql";
import MessageError from "./MessageError";

function TeacherEditTest({ test, courseId, chapterIndex, testIndex }) {
    const { onChange, onSubmit, values, setValues } = useForm(
        () => {updateTest()},
         {
                  question: '',
                  variants: [],
                  answer: [],
              }
    );
    const [errors, setErrors] = useState({});
    const [updateTest, { loading }] = useMutation(UPDATE_TEST, {
        update(proxy, { data}) {
            try {
                const data = proxy.readQuery({
                    query: GET_COURSE,
                    variables: { courseId: courseId },
                });
                data.getCourse.chapters[chapterIndex].tests[testIndex].variants = values.variants;
                data.getCourse.chapters[chapterIndex].tests[testIndex].answer = values.answer;
                proxy.writeQuery({ query: GET_COURSE, data });
                setErrors({});
            } catch (e) {
                console.log(e);
            }
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: {
            courseId,
            chapterIndex,
            testIndex,
            question: values.question,
            answer: values.answer,
            variants: values.variants,
        },
    });
    useEffect(() => {

            setValues({
                question: test.question,
                variants: test.variants ? test.variants : [],
                answer: test.answer ? test.answer : [],
            });

    }, [test, setValues]);
    if (!test) return null;

    return (
        <Segment>
            <Form onSubmit={onSubmit}>
                <Form.Input
                    name="question"
                    onChange={onChange}
                    value={values.question}
                />
                <List style={{ padding: '0' }}>
                    {values.variants && values.variants.map((variant, varIndex) => (
                        <List.Item
                            key={varIndex}
                            style={{ display: 'flex', alignItems: 'baseline' }}
                        >
                            <Form.Checkbox
                                onClick={() => {
                                    let foundIndex = values.answer.indexOf(
                                        varIndex
                                    );
                                    if (foundIndex !== -1) {
                                        values.answer.splice(foundIndex, 1);
                                        setValues({ ...values });
                                    } else {
                                        values.answer = [
                                            ...values.answer,
                                            varIndex,
                                        ];
                                        setValues({ ...values });
                                    }
                                }}
                                checked={
                                    values.answer &&
                                    values.answer.includes(varIndex)
                                }
                            />
                            <div style={{ flexGrow: '1', marginLeft: '5px' }}>
                                <Form.Input
                                    value={values.variants[varIndex]}
                                    onChange={(e) => {
                                        let newArr = values.variants;
                                        newArr[varIndex] = e.target.value;
                                        setValues({
                                            ...values,
                                            variants: newArr,
                                        });
                                    }}
                                />
                            </div>
                            <Button
                                basic
                                style={{ marginLeft: '5px' }}
                                icon="minus"
                                onClick={() => {
                                    let newArr = values.variants;
                                    newArr.splice(varIndex, 1);
                                    values.answer = [];
                                    setValues({ ...values, variants: newArr });
                                }}
                            />
                        </List.Item>
                    ))}
                </List>
                <Button
                    style={{ margin: '10px 0 10px 0' }}
                    basic
                    icon="plus"
                    onClick={() => {
                        values.variants.push('новий варіант');
                        setValues({ ...values });
                    }}
                />
                <Form.Button

                    loading={loading}
                    secondary
                    type={'submit'}
                >
                    Оновити тест
                </Form.Button>
            </Form>
            {Object.keys(errors).length > 0 &&
            <MessageError errors={errors}/>
            }

        </Segment>
    );
}

const UPDATE_TEST = gql`
    mutation updateTest(
        $courseId: ID!
        $chapterIndex: Int!
        $testIndex: Int!
        $question: String!
        $answer: [Int!]!
        $variants: [String!]!
    ) {
        updateTestInChapter(
            courseId: $courseId
            chapterIndex: $chapterIndex
            testIndex: $testIndex
            test: { question: $question, answer: $answer, variants: $variants }
        )
    }
`;

export default TeacherEditTest;
