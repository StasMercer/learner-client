import { Button, Card, Icon, Label } from 'semantic-ui-react';
import React from 'react';
import moment from 'moment';
import 'moment/locale/uk';
import { Link } from 'react-router-dom';


function CourseCard({ course }) {
    moment.locale('uk');

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{course.courseName}</Card.Header>

                <Card.Description style={{ marginBottom: '5px' }}>
                    {course.description}
                </Card.Description>
                <Card.Meta>Автор: {course.ownerName}</Card.Meta>
                <Card.Meta>
                    Створено: {moment(course.createdAt).format('LL')}
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Label style={{ marginTop: '4px' }} color={'grey'}>
                    <Icon name="user" />
                    <span style={{ marginRight: '5px' }}>
                        {course.membersCount}
                    </span>
                </Label>

                <Button
                    as={Link}
                    to={'/course/' + course.id}
                    size={'small'}
                    floated={'right'}
                    primary
                >
                    Відкрити
                </Button>

            </Card.Content>
        </Card>
    );
}

export default CourseCard;
