import React, {useContext} from "react";
import {Link, useParams} from 'react-router-dom'
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag/src";
import UserInCourse from "../components/UserInCourse";
import {Button, Card, Container, Grid, Icon, Image, List, Loader, Message} from "semantic-ui-react";
import {GET_COURSE, GET_USER_PROGRESS} from "../utils/graphql";
import {AuthContext} from "../context/auth";

function Course(props) {
    const {courseId} = useParams();
    const {user} = useContext(AuthContext);

    const {data: userData, loading: userLoading} = useQuery(GET_USER_COURSES)
    const { data, loading, error} = useQuery(GET_COURSE, {variables: {courseId}})
    const [addUser] = useMutation(ADDUSERTOCOURSE, {
        update(proxy,{data:{addUserToCourse:{progress}}}){
            try{
                const data = proxy.readQuery({
                    query: GET_USER_PROGRESS
                });
                data.getUser.progress = progress;

                proxy.writeQuery({query: GET_USER_PROGRESS, data});
            }catch (e) {
                console.log(e)
            }

        },


        onError(err) {
            console.log(err)
        },
        variables: {courseId},
    });
    if(error) return <Message error> Not found</Message>;
    if (userLoading || loading) return (<Loader active inline='centered'/>);
    if(user){
        const userInCourseIndex = userData.getUser.progress.findIndex(item => {
            return item.courseId === courseId ? item : ''
        });

        if (userInCourseIndex !== -1) {
            return (<UserInCourse course={ data.getCourse}/>)
        }
    }




    function addUserToCourse() {
        addUser().then(r => {

        });
    }

    return (
        <Grid  stackable verticalAlign='middle' container columns={2}>
            <Grid.Row>
                <Grid.Column width={10} floated={"left"}>
                    <Card>
                        <Card.Content>
                            <Card.Header>{data && data.getCourse.courseName}</Card.Header>
                        </Card.Content>
                    </Card>
                </Grid.Column>

                <Grid.Column  width={2} floated={'right'}>
                    {user?(<Button onClick={addUserToCourse} as={Link} to={'/course/'+ courseId} primary>Записатись</Button>):(
                        <Button as={Link} to={'/register'} primary>Записатись</Button>
                    )}

                </Grid.Column>


            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={16}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>Що ви навчитесь:</Card.Header>
                            <Card.Description>
                                <Container textAlign={'justified'}>
                                    {data && data.getCourse.description}
                                </Container>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                </Grid.Column>

            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Card>
                        <Card.Content>
                            <Card.Header>Програма курсу:</Card.Header>
                            <Card.Description>
                                <List divided>
                                    {data.getCourse.chapters.map(element => (
                                        <List.Item key={element.id}>
                                            <Icon name={element.type === 'lecture' ? 'book' : 'question'} />
                                            <List.Content>
                                                {element.chapterName}
                                            </List.Content>

                                        </List.Item>
                                    ))}
                                </List>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>

            </Grid.Row>

            <Grid.Row>

                <Grid.Column>
                    <Card>

                        <Card.Content>
                            <Card.Header>Вчитель</Card.Header>
                            <Card.Description>
                                {data.getCourse.ownerName}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>

            </Grid.Row>


        </Grid>
    )
}

const ADDUSERTOCOURSE = gql`
 mutation addUserToCourse($courseId: ID!){
     addUserToCourse(courseId: $courseId){
         id
         progress{
             right
             wrong
             courseId
             courseName
             chapters{
                 studentTest{
                     testMade
                     rightAnswer
                     studentAnswer
                 }
                 wasMade
                 
             }
         }
     }
 }

`;


const GET_USER_COURSES = gql`
    query getUser{
        getUser{
            
            progress{
                right
                wrong
                courseId
            }
        }
    }

`

export default Course;