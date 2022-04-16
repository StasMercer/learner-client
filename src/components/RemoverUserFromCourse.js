import {Button, Header, Icon, Modal} from "semantic-ui-react";
import React, {useState} from "react";
import {useMutation} from "@apollo/react-hooks";
import {GET_USER_PROGRESS, REMOVE_USER_FROM_COURSE} from "../utils/graphql";

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
            <Header icon='archive' content='Confirm action' />
            <Modal.Content>
                <p>
                    Are you sure, all progress will be deleted.
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={()=>setModalOpen(false)} basic color='red' inverted>
                    <Icon name='remove' /> NO
                </Button>
                <Button onClick={handleRemove} color='green' inverted>
                    <Icon name='checkmark' /> YES
                </Button>
            </Modal.Actions>
        </Modal>
    )
}



export default RemoveUserFromCourse;