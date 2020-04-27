import React from 'react'
import Content from "../components/Content";
import {Icon, Label, List, Step} from "semantic-ui-react";

export default function Home() {
    const contentId = "5ea681e46d158466c8e1720c";

    return (
        <div >
            <h1>Як це працює:</h1>
            <Step.Group fluid>
                <Step>
                    <Icon name='search' />
                    <Step.Content>
                        <Step.Title>Знайди потрібний тобі курс</Step.Title>

                    </Step.Content>
                </Step>

                <Step>
                    <Icon name='tasks' />
                    <Step.Content>
                        <Step.Title>Проходь все поетапно</Step.Title>

                    </Step.Content>
                </Step>

                <Step>
                    <Icon name='payment' />
                    <Step.Content>
                        <Step.Title>Отримай сертифікат</Step.Title>
                    </Step.Content>
                </Step>
            </Step.Group>
            <h1>
                Можливості для учня:
            </h1>
            <List >
                <List.Item>
                    <Label size={"large"} color={"blue"}>Широкий вибір курсів</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"teal"}>Можливість проходити курс поетапно</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"orange"}>Відсліджування прогресу</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"purple"}>Отримання сертифікату</Label>
                </List.Item>
            </List>

            <h1>
                Можливості для вчителя:
            </h1>
            <List >
                <List.Item>
                    <Label size={"large"} color={"brown"}>Зручний інтерфейс для створення курсів</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"green"}>Редагування курсу будь-коли</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"olive"}>Завантаження відео-лекцій</Label>
                </List.Item>
                <List.Item >
                    <Label size={"large"} color={"violet"}>Завантаження pdf-документів</Label>
                </List.Item>
            </List>

            <Content contentId={contentId}/>
        </div>
    )
}
