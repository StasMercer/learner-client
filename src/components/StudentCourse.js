import React, {useContext, useState} from "react";
import {Button, Card, Container, Embed, Icon, Menu, Message, Segment, Sidebar} from "semantic-ui-react";
import Test from "./Test";
import {useMutation} from "@apollo/react-hooks";
import {GET_USER_PROGRESS, UPDATE_USER_PROGRESS} from "../utils/graphql";
import generatePdf from "../utils/generateCert";
import {AuthContext} from "../context/auth";


function StudentCourse({course, userChapters, right, wrong}) {
    const {user} = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [passChapter] = useMutation(UPDATE_USER_PROGRESS, {
        update(
            proxy,
            {
                data: {
                    updateUserProgress: { progress },
                },
            }
        ) {
            const data = proxy.readQuery({
                query: GET_USER_PROGRESS,
            });
            data.getUser.progress = progress;

            proxy.writeQuery({ query: GET_USER_PROGRESS, data });
            setChapterIndex(chapterIndex + 1);
        },
        onError(err) {
            console.log(err);
        },
        variables: {
            courseId: course.id,
            chapterIndex,
            wasMade: true,
        },
    });

    if (!course.chapters.length)
        return (
            <Message>
                {' '}
                Цей курс поки що порожній, чекайте на оновлення від вчителя
            </Message>
        );


    function updateUser() {
        passChapter();
    }

    function getCertificate() {
        generatePdf(user.firstName, user.lastName,  course.courseName, course.ownerName, right, wrong);
    }

    return(
        <Sidebar.Pushable as={Segment} style={{ marginBottom: '30px' }}>
            <Sidebar
                as={Menu}
                animation="overlay"
                inverted
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width="thin"
            >
                <Menu.Item onClick={() => setVisible(false)} fluid as={Button}>
                    Закрити
                    <Icon name="close" />
                </Menu.Item>
                {course.chapters.map((chap, index) => (
                    <Menu.Item
                        onClick={() => {
                            setChapterIndex(index);
                            setVisible(false);
                        }}
                        as={'a'}
                        key={chap.id}
                    >
                        {chap.chapterName}

                        {userChapters[index] && userChapters[index].wasMade ? (
                            <Icon name={'check'} />
                        ) : (
                            <Icon
                                name={
                                    chap.type === 'lecture'
                                        ? 'book'
                                        : chap.type === 'control' ? 'chess queen' : 'question'
                                }
                            />
                        )}
                    </Menu.Item>
                ))}
            </Sidebar>

            <Sidebar.Pusher>
                <Segment basic>
                    <Button
                        basic
                        icon
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        <Icon name={'bars'} />
                    </Button>

                    <p></p>
                    <h1>{course.chapters[chapterIndex].chapterName}</h1>
                    {course.chapters[chapterIndex].media && (
                        <Embed
                            icon="play"
                            url={course.chapters[chapterIndex].media}
                        />
                    )}

                    <Card fluid>
                        <Card.Content>
                            <Card.Description>
                                <Container
                                    style={{
                                        fontSize: '1.5em',
                                        lineHeight: '1.5em',
                                    }}
                                    textAlign={'justified'}
                                >
                                    {course.chapters[chapterIndex].text}
                                </Container>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                    {course.chapters[chapterIndex].tests.length > 0 && (
                        <Card fluid>
                            <Card.Content>
                                <Test
                                    tests={course.chapters[chapterIndex].tests}
                                    courseId={course.id}
                                    chapterIndex={chapterIndex}
                                    userProgress={userChapters[chapterIndex]}
                                />
                            </Card.Content>
                        </Card>
                    )}

                    {course.chapters.length > chapterIndex + 1 ? (
                        <Button
                            style={{ marginBottom: '10px' }}
                            onClick={updateUser}
                            primary
                            floated={'right'}
                        >
                            Далі
                        </Button>
                    ):(<Button
                        style={{ marginBottom: '10px' }}
                        onClick={getCertificate}
                        primary
                        floated={'right'}
                    >
                        Отримати сертифікат
                    </Button>)}
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
}

export default StudentCourse;