import React, {useContext, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Button, Grid, Icon, Input, Label, List, Loader, Segment} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {AuthContext} from "../context/auth";
import AddToCycle from "../components/AddToCycle";
import {CREATE_CYCLE, GET_CYCLES, REMOVE_COURSE_FROM_CYCLE, REMOVE_CYCLE} from "../utils/graphql";

function CycleCourses() {
    const {user} = useContext(AuthContext)
    const [cycleName, setCycleName] = useState('');
    const { data, loading, refetch } = useQuery(GET_CYCLES);
    const [removeCourse] = useMutation(REMOVE_COURSE_FROM_CYCLE, {
        update(proxy, {data:{removeCourseFromCycle: cycle}}){
                refetch();
        },
        onError(e){
            console.log(e)
        },

    })
    const [removeCycle] = useMutation(REMOVE_CYCLE);
    const [createCycle] = useMutation(CREATE_CYCLE);

    const colors = [
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
    ];
    if (loading) return <Loader active inline="centered" />;
    let cycle = data.getCycles;
    return (
        <Grid stackable columns={2}>
            {cycle.map((elem, cycleIndex) => (
                <Grid.Column key={elem.id}>
                    {user && user.role === 'admin' && <Icon name={"trash"}  link onClick={()=>{
                        removeCycle({variables:{cycleId: elem.id}}).then(()=>refetch());
                    }}/>}
                    <Segment loading={loading} textAlign={"center"}>

                        <h3>{elem.cycleName}</h3>

                        <List>
                            {elem.courses.map((course, index) => (
                                <div key={index}>
                                    <List.Item style={{marginBottom: '10px'}}>
                                        <Label

                                            as={Link}
                                            to={'course/' + course.courseId}
                                            color={
                                                colors[(index+cycleIndex)%colors.length]
                                            }
                                        >
                                            {course.courseName}
                                        </Label>
                                        {user && user.role === 'admin' && <Icon onClick={()=>{
                                            removeCourse({variables:{courseIndex: index, cycleId:elem.id}})
                                        }} link name={'close'}/>}
                                    </List.Item>

                                </div>

                            ))}
                        </List>
                        {user && user.role === 'admin' && <AddToCycle cycleIndex={cycleIndex} courses={elem.courses} cycleId={elem.id}/> }
                    </Segment>
                </Grid.Column>
            ))}
            {user && user.role === 'admin' && (
                <Grid.Column>
                    <Grid.Row>
                        <Input value={cycleName} placeholder={'Введіть імя нового циклу'} onChange={(e)=>setCycleName(e.target.value)}/>
                        <Button style={{marginLeft: '10px'}} icon={'plus'} basic onClick={() => {
                            if(cycleName.trim() !== ''){
                                createCycle({variables:{cycleName}}).then(()=> refetch());
                            }
                        }}/>
                    </Grid.Row>
                </Grid.Column>
            )}

        </Grid>
    );
}



export default CycleCourses;
