import React, { useContext } from 'react';
import { Loader } from 'semantic-ui-react';
import { GET_USER_PROGRESS } from '../utils/graphql';

import { useQuery } from '@apollo/react-hooks';
import { AuthContext } from '../context/auth';
import StudentCourse from './StudentCourse';
import TeacherCourse from './TeacherCourse';

function UserInCourse({ course }) {
    const { user } = useContext(AuthContext);

    const { loading, error, data } = useQuery(GET_USER_PROGRESS, {});

    let userChapters = {};
    let courseProgress = {};
    if (error) {
        return <p>{error}</p>;
    }
    if (loading) {
        return <Loader active inline="centered" />;
    }

    if (data) {
        courseProgress = data.getUser.progress.find(
            (element) => element.courseId === course.id
        );
        userChapters = courseProgress.chapters;
    }

    return (
        <div>
            {user.id === course.owner ? (
                <TeacherCourse course={course} />
            ) : (
                <StudentCourse
                    right={courseProgress.right}
                    wrong={courseProgress.wrong}
                    course={course}
                    userChapters={userChapters}
                />
            )}
        </div>
    );
}

export default UserInCourse;
