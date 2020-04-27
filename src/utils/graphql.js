import gql from 'graphql-tag/src';

const UPDATE_USER_PROGRESS = gql`
    mutation updateUserProgress(
        $courseId: ID!
        $wasMade: Boolean!
        $chapterIndex: Int!
        $testIndex: Int
        $rightAnswer: [Int]
        $studentAnswer: [Int]
    ) {
        updateUserProgress(
            courseId: $courseId
            wasMade: $wasMade
            chapterIndex: $chapterIndex
            testIndex: $testIndex
            rightAnswer: $rightAnswer
            studentAnswer: $studentAnswer
        ) {
            progress {
                chapters {
                    studentTest {
                        testMade
                        rightAnswer
                        studentAnswer
                    }
                    wasMade
                }
                right
                wrong
                courseId
                courseName
            }
        }
    }
`;

const GET_USER_PROGRESS = gql`
    query getUser {
        getUser {
            progress {
                right
                wrong
                courseId
                chapters {
                    wasMade
                    studentTest {
                        testMade
                        rightAnswer
                        studentAnswer
                    }
                }
            }
        }
    }
`;

const GET_COURSE = gql`
    query getCourse($courseId: ID!) {
        getCourse(courseId: $courseId) {
            id
            courseName
            description
            ownerName
            owner
            chapters {
                id
                type
                chapterName
                text
                media
                tests {
                    question
                    variants
                    answer
                }
            }
        }
    }
`;
const GET_CYCLES = gql`
    query getCycles {
        getCycles {
            courses {
                courseId
                courseName
            }
            cycleName
            id
        }
    }
`;

const REMOVE_COURSE_FROM_CYCLE = gql`
    mutation removeCourse($courseIndex: Int!, $cycleId: ID!) {
        removeCourseFromCycle(cycleId: $cycleId, courseIndex: $courseIndex) {
            courses {
                courseId
                courseName
            }
            cycleName
            id
        }
    }
`;

const REMOVE_COURSE = gql`
    mutation deleteCourse($courseId: ID!){
        removeCourse(courseId: $courseId)
    }

`

const CREATE_CYCLE = gql`
    mutation createCycle($cycleName: String!) {
        createCycle(cycleName: $cycleName) {
            courses {
                courseId
                courseName
                id
            }
            cycleName
            id
        }
    }
`;
const REMOVE_CYCLE = gql`
    mutation removeCycle($cycleId: ID!) {
        removeCycle(cycleId: $cycleId) {
            cycleName
            id
        }
    }
`;

const CREATE_ADMIN_CONTENT = gql`
    mutation createContent($contentName: String!){
        createAdminContent(contentName: $contentName){
            id
            contentName
            messages{
                createdAt
                messageHeader
                messageText
            }
        }
    }

`
const GET_CONTENT = gql`
    query getContent{
        getAdminContent{
            contentName
            id
            messages{
                createdAt
                messageHeader
                messageText
            }
        }
    }
`

const REMOVE_CONTENT = gql`
    mutation removeContent($contentId: ID!){
        removeAdminContent(contentId: $contentId){
            id
        }
    }
`
const GET_CONTENT_BY_ID = gql`
    query getContentById($contentId: ID!){
        getAdminContentById(contentId: $contentId){
            messages{
                createdAt
                messageHeader
                messageText
            }
            id
            contentName
        }
        
    }

`

const ADD_ADMIN_MESSAGE = gql`
    mutation addMessage($contentId: ID!, $messageHeader: String!, $messageText: String!){
        addMessage(messageText: $messageText, contentId: $contentId, messageHeader: $messageHeader){
            id
            contentName
            messages{
                createdAt
                messageHeader
                messageText
            }
        }
    }

`

const REMOVE_ADMIN_MESSAGE = gql`
    mutation removeMessage($contentId: ID!, $messageIndex: Int!){
        removeMessage(contentId: $contentId, messageIndex: $messageIndex){
            id
            contentName
            messages{
                createdAt
                messageHeader
                messageText
            }
        }
        
    }

`

export {
    UPDATE_USER_PROGRESS,
    GET_USER_PROGRESS,
    GET_COURSE,
    GET_CYCLES,
    REMOVE_COURSE_FROM_CYCLE,
    REMOVE_COURSE,
    CREATE_CYCLE,
    REMOVE_CYCLE,
    CREATE_ADMIN_CONTENT,
    REMOVE_CONTENT,
    GET_CONTENT,
    GET_CONTENT_BY_ID,
    ADD_ADMIN_MESSAGE,
    REMOVE_ADMIN_MESSAGE
};
