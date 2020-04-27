import React, {useState} from 'react';
import { Dropdown, Icon, Input} from "semantic-ui-react";
import {useMutation} from "@apollo/react-hooks";
import {withRouter} from 'react-router-dom'

import {CREATE_ADMIN_CONTENT, GET_CONTENT} from "../utils/graphql";

function AddAdminContent(props) {

    const [contentName, setContentName] = useState('');
    const [createContent] = useMutation(CREATE_ADMIN_CONTENT, {
        update(proxy, {data:{createAdminContent: cont}}){
            try{
                const data = proxy.readQuery({
                    query: GET_CONTENT
                });
                data.getAdminContent = [...data.getAdminContent, cont];
                proxy.writeQuery({query: GET_CONTENT, data});
                props.history.push('/content/'+cont.contentName+'/'+cont.id);
            }catch (e) {
                console.log(e)
            }
        },
        onError(e){
            console.log(e)
        },
        variables:{contentName}
    });
    return (
        <Dropdown.Item>
            <div>
                <Input  onClick={e => e.stopPropagation()} placeholder={"Новий розділ"} value={contentName} onChange={(e)=>setContentName(e.target.value)}/>
                <Icon style={{paddingLeft:'10px'}} name={"plus"} onClick={e => {
                    e.stopPropagation();
                    if(contentName.trim() !== '') createContent();

                }}/>
            </div>

        </Dropdown.Item>

    );
}

export default withRouter(AddAdminContent);