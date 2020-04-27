import React from 'react'
import gql from "graphql-tag/src";
import {useQuery} from "@apollo/react-hooks";
import CourseCard from "../components/CourseCard";
import {Button, Loader} from "semantic-ui-react";

function Courses() {
    const { data, loading, fetchMore} = useQuery(GET_COURSES, {
        variables: {after: null}
    });

    if(loading){
        return (<Loader active inline='centered'/>)
    }


    return (

        <div>
            {data && data.getCoursesFeed.courses.map(course => (
                    <CourseCard style={{marginBottom: '15px'}} key={course.id} course={course}/>
                )
            )
            }
            {data && data.getCoursesFeed.hasMore && <Button onClick={() => {

                const newCursor = data.getCoursesFeed.cursor;
                fetchMore({
                    variables: {after: newCursor},
                    updateQuery: (prevResult, {fetchMoreResult}) => {
                        fetchMoreResult.getCoursesFeed.courses = [
                            ...prevResult.getCoursesFeed.courses,
                            ...fetchMoreResult.getCoursesFeed.courses
                        ]
                        return fetchMoreResult;
                    }
                })
            }

            }>Завантажити ще</Button>}

        </div>
    )
}

const GET_COURSES = gql`
    query getCoursesFeed($after: String){
        getCoursesFeed(pageSize: 10, after: $after){
            cursor
            hasMore
            courses{
                ownerName
                description
                membersCount
                createdAt
                id
                courseName
                owner
            }

        }
    }

`

export default Courses