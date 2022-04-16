import React from 'react'
import Content from "../components/Content";
import {Icon, Label, List, Step} from "semantic-ui-react";

export default function Home() {
    const contentId = "5ea681e46d158466c8e1720c";

    return (
        <div >
            <h1>How does it work:</h1>
            <Step.Group fluid>
                <Step>
                    <Icon name='search' />
                    <Step.Content>
                        <Step.Title>Find the course you need</Step.Title>

                    </Step.Content>
                </Step>

                <Step>
                    <Icon name='tasks' />
                    <Step.Content>
                        <Step.Title>Learn step by step</Step.Title>

                    </Step.Content>
                </Step>

                <Step>
                    <Icon name='payment' />
                    <Step.Content>
                        <Step.Title>Get the sertificate</Step.Title>
                    </Step.Content>
                </Step>
            </Step.Group>
            <h1>
                What you get as a student:
            </h1>
            <List >
                <List.Item>
                    <Label size={"large"} color={"blue"}>Wide range of courses</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"teal"}>Step by step learning</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"orange"}>Track your proggress</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"purple"}>Get the sertificate</Label>
                </List.Item>
            </List>

            <h1>
                What you get as a teacher:
            </h1>
            <List >
                <List.Item>
                    <Label size={"large"} color={"brown"}>Convinient interface to create courses</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"green"}>Edit courses whenever you want</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"olive"}>Video upload support</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"violet"}>PDF upload support</Label>
                </List.Item>
            </List>

            <Content contentId={contentId}/>
        </div>
    )
}
