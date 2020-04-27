import {Button, Header, Icon, Modal} from "semantic-ui-react";
import React, {useState} from "react";
import gql from "graphql-tag/src";
import {useMutation} from "@apollo/react-hooks";
import {GET_USER_PROGRESS} from "../utils/graphql";

function RemoveUserFromCourse({courseId}) {
    const [modalOpen, setModalOpen] = useState(false)
    const [removeUser] = useMutation(REMOVE_USER_FROM_COURSE, {
        update(proxy, {data: {removeUserFromCourse: {progress}}}) {
            const data = proxy.readQuery({
                query: GET_USER_PROGRESS
            });
            data.getUser.progress = progress;

            proxy.writeQuery({query: GET_USER_PROGRESS, data});
        },
        onError(err) {
            console.log(err)
        },
        variables: {
            courseId
        }
    })
    function handleRemove() {
        removeUser();
        setModalOpen(false);
    }
    return(
        <Modal
            open={modalOpen}
            onClose={()=> setModalOpen(false)}
            trigger={<Icon onClick={()=>{
            setModalOpen(true);
            }} name="close"> </Icon>}
               basic size='small'>
            <Header icon='archive' content='Підтвердіть дію' />
            <Modal.Content>
                <p>
                    Ви дійсно хочете вийти з курсу. Досягнений прогрес буде видалено
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={()=>setModalOpen(false)} basic color='red' inverted>
                    <Icon name='remove' /> Ні
                </Button>
                <Button onClick={handleRemove} color='green' inverted>
                    <Icon name='checkmark' /> Так
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

const REMOVE_USER_FROM_COURSE = gql`
    mutation removeUserFromCourse($courseId: ID!){
        removeUserFromCourse(courseId: $courseId){
            progress{
                right
                wrong
                courseId
                chapters{
                    wasMade
                    
                    studentTest{
                        testMade
                        rightAnswer
                        studentAnswer
                    }
                    
                }
                courseName
            }
        }
    }

`

export default RemoveUserFromCourse;