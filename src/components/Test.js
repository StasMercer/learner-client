import React, {useEffect, useState} from "react";
import {Button, Checkbox, List, Message} from "semantic-ui-react";
import {useMutation} from "@apollo/react-hooks";
import {GET_USER_PROGRESS, UPDATE_USER_PROGRESS} from '../utils/graphql';

function Test({tests, courseId, chapterIndex, userProgress}) {
    const [answer, setAnswer] = useState([]);
    const [testIndex, setTestIndex] = useState(-1);
    const [updateProgress] = useMutation(UPDATE_USER_PROGRESS, {
        update(proxy, {data: {updateUserProgress: {progress}}}) {
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
            testIndex,
            rightAnswer: testIndex!== -1 ?tests[testIndex].answer: [],
            studentAnswer: answer[testIndex],
            courseId,
            wasMade: false,
            chapterIndex
        }
    })


    useEffect(()=>{
        if(testIndex > -1){
            updateProgress();
        }
    }, [testIndex, updateProgress])
    return (
        <div>

            {tests.map((test, index) => (
                <div key={index}>
                    <h3>{test.question}</h3>
                    <List>
                        {test.variants.map((variant, varIndex) => (
                            <List.Item key={variant}>
                                <Message success={userProgress && userProgress.studentTest[index] && userProgress.studentTest[index].testMade && test.answer.includes(varIndex)}>


                                    {userProgress && userProgress.studentTest[index] && userProgress.studentTest[index].testMade? (<Checkbox
                                        label={variant}

                                        checked={userProgress &&  userProgress.studentTest[index]&& userProgress.studentTest[index].studentAnswer.includes(varIndex)}/>)
                                        :
                                        (<Checkbox onClick={() => {
                                            let foundIndex = answer[index] ? answer[index].indexOf(varIndex): -1;

                                            if (foundIndex !== -1) {
                                                answer[index].splice(foundIndex, 1);

                                                setAnswer([...answer]);

                                            } else {
                                                if(!answer[index]) answer[index] = [];
                                                answer[index].push(varIndex);
                                                setAnswer([...answer])
                                            }

                                        }} label={variant}/>
                                    )}


                                </Message>

                            </List.Item>

                        ))}
                        {(!userProgress || !(userProgress.studentTest[index] && userProgress.studentTest[index].testMade) )&& <Button onClick={()=>{
                            setTestIndex(index);
                        }} style={{marginTop: '10px'}} secondary>Здати тест</Button>}

                    </List>
                </div>

            ))}



        </div>


    )
}


export default Test;