import React, { useState } from 'react';
import {
    Button,
    Confirm,
    Dropdown,
    Icon,
    Menu,
    Segment,
    Sidebar,
} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import TeacherEditChapter from './TeacherEditChapter';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag/src';
import {GET_COURSE, REMOVE_COURSE} from '../utils/graphql';

function TeacherCourse({ course, history }) {
    const [visible, setVisible] = useState(false);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [chapterValues, setChapterValues] = useState({
        chapterName: '',
        text: '',
        type: '',
        courseId: '',
    });
    const [openConfirm, setOpenConfirm] = useState(false);

    const [addChapter] = useMutation(ADD_CHAPTER_TO_COURSE, {
        update(
            proxy,
            {
                data: {
                    addChapterToCourse: { chapters },
                },
            }
        ) {
            try {
                const data = proxy.readQuery({
                    query: GET_COURSE,
                    variables: { courseId: course.id },
                });
                data.getCourse.chapters = chapters;
                proxy.writeQuery({ query: GET_COURSE, data });
            } catch (e) {
                console.log(e);
            }
        },
        onError(err) {
            console.log(err);
        },
        variables: chapterValues,
    });

    const [removeChapter] = useMutation(REMOVE_CHAPTER_FROM_COURSE, {
        update(
            proxy,
            {
                data: {
                    removeChapterFromCourse: { chapters },
                },
            }
        ) {
            try {
                const data = proxy.readQuery({
                    query: GET_COURSE,
                    variables: { courseId: course.id },
                });
                data.getCourse.chapters = chapters;
                proxy.writeQuery({ query: GET_COURSE, data });
            } catch (e) {
                console.log(e);
            }
        },
        onError(err) {
            console.log(err);
        },
        variables: { courseId: course.id, chapterIndex },
    });

    async function handleRemoveChapter() {
        await setOpenConfirm(false);
        await removeChapter();
    }
    const [removeCourseOpen, setRemoveCourseOpen] = useState(false);
    const [removeCourse] = useMutation(REMOVE_COURSE)
    async function handleRemoveCourse() {
        await setRemoveCourseOpen(false);
        await removeCourse({variables:{courseId: course.id}}).then(r=>{
            if(r.data.removeCourse){
                history.push('/');
            }

        });
    }
    async function handleAddChapter(type) {
        let chapterName = 'Новий розділ' + (course.chapters.length + 1);
        let text = 'Напишіть текст';
        await setChapterValues({
            chapterName,
            text,
            type,
            courseId: course.id,
        });
        await addChapter();
    }

    return (
        <Sidebar.Pushable as={Segment}>
            <Sidebar
                as={Menu}
                animation="overlay"
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
            >
                <Menu.Item onClick={() => setVisible(false)} fluid as={Button}>
                    Закрити
                    <Icon name="close" />
                </Menu.Item>
                {course.chapters.map((chapter, index) => {
                    return (
                        <Menu.Item
                            fluid
                            key={chapter.id}
                            as={Button}
                            onClick={() => {
                                setVisible(false);
                                setChapterIndex(index);
                            }}
                        >
                            {chapter.chapterName}

                            <Icon
                                name={'close'}
                                onClick={() => {
                                    setOpenConfirm(true);
                                }}
                            />
                        </Menu.Item>
                    );
                })}
                {!course.chapters.find((elem) => elem.type === 'control') && (
                    <Menu.Item>
                        <div>
                            <Dropdown fluid text={'Додати'}>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => {
                                            handleAddChapter('lecture');
                                        }}
                                        icon={'book'}
                                        text={'Лекція'}
                                    />
                                    <Dropdown.Item
                                        onClick={() => handleAddChapter('test')}
                                        text={'Тест'}
                                        icon={'question'}
                                    />

                                    <Dropdown.Item
                                        onClick={() =>
                                            handleAddChapter('control')
                                        }
                                        text={'Контроль'}
                                        icon={'chess queen'}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Menu.Item>
                )}
                <Menu.Item onClick={() => setRemoveCourseOpen(true)} fluid  as={Button}>
                    Видалити курс
                    <Icon name="trash" />
                </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher style={{ minHeight: '200px' }}>
                <Segment basic>
                    <Button
                        basic
                        icon
                        onClick={() => {
                            setVisible(true);
                        }}
                        style={{ marginBottom: '10px' }}
                    >
                        <Icon name={'bars'} />
                    </Button>

                    {course.chapters.length > 0 && (
                        <TeacherEditChapter
                            courseId={course.id}
                            chapterIndex={chapterIndex}
                            chapter={course.chapters[chapterIndex]}
                        />
                    )}
                    <Confirm
                        open={openConfirm}
                        content="Ви впевнені що хочете видалити частину?"
                        cancelButton={'Ні'}
                        confirmButton={'Так'}
                        onCancel={() => setOpenConfirm(false)}
                        onConfirm={handleRemoveChapter}
                    />
                    <Confirm
                        open={removeCourseOpen}
                        content="Ви впевнені що хочете видалити курс"
                        cancelButton={'Ні'}
                        confirmButton={'Так'}
                        onCancel={() => setRemoveCourseOpen(false)}
                        onConfirm={handleRemoveCourse}
                    />
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
}

const ADD_CHAPTER_TO_COURSE = gql`
    mutation addChapter(
        $courseId: ID!
        $chapterName: String!
        $text: String!
        $type: String!
    ) {
        addChapterToCourse(
            chapterInput: {
                courseId: $courseId
                chapterName: $chapterName
                text: $text
                type: $type
            }
        ) {
            chapters {
                tests {
                    question
                    answer
                    variants
                }
                chapterName
                media
                text
                id
                type
            }
        }
    }
`;

const REMOVE_CHAPTER_FROM_COURSE = gql`
    mutation removeChapter($courseId: ID!, $chapterIndex: Int!) {
        removeChapterFromCourse(
            courseId: $courseId
            chapterIndex: $chapterIndex
        ) {
            chapters {
                tests {
                    question
                    answer
                    variants
                }
                chapterName
                media
                text
                id
                type
            }
        }
    }
`;

export default withRouter(TeacherCourse);
