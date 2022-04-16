import React, { useState } from 'react';
import {Input, Label, List} from 'semantic-ui-react';
import gql from "graphql-tag/src";
import {useLazyQuery, useMutation} from "@apollo/react-hooks";
import {GET_CYCLES} from "../utils/graphql";

function AddToCycle({ cycleId, courses, cycleIndex }) {
    const [value, setValue] = useState('');
    const [searchRes, setSearchRes] = useState([]);
    const [addCourse] = useMutation(ADD_COURSE_TO_CYCLE, {
        update(proxy, {data:{addCourseToCycle: res}}){
            try{
                const data = proxy.readQuery({
                    query: GET_CYCLES
                });
                data.getCycles[cycleIndex] = res;
                proxy.writeQuery({query: GET_CYCLES, data});
            }catch (e) {
                console.log(e)
            }
        },
        onError(e){
            console.log(e)
        },
        variables: {}
    })
    const [search] = useLazyQuery(SEARCH_COURSES, {
        onCompleted({searchCourses : res}){
            let result = res.filter(item => {
                return !courses.find(c=> (c.courseId === item.id));
            })
            setSearchRes(result);
        },
        variables: {partOfName: value}})


    return (
        <div>
            <Input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    if(e.target.value.length > 2) {
                        search();
                    }
                }}
                placeholder={'Add course'}
            />
            {searchRes && (
                <List>
                    {searchRes.map((elem) => (
                        <List.Item key={elem.id}>
                            <Label as={'a'} onClick={()=> {
                                setValue('');
                                addCourse({variables: {cycleId, courseId: elem.id}})
                            }} color={"grey"}>
                                {elem.courseName}
                            </Label>
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    );
}
const SEARCH_COURSES = gql`
    query searchCourses($partOfName: String!){
        searchCourses(partOfName: $partOfName){
            id
            courseName
        }
    }
    
`
const ADD_COURSE_TO_CYCLE = gql`
    mutation addCourse($cycleId: ID!, $courseId:ID!){
        addCourseToCycle(courseId: $courseId, cycleId: $cycleId){
            courses{
                courseId
                courseName
            }
            id
            cycleName
        }
    }

`
export default AddToCycle;
