
import {Badge, Button, Container, Group, Space, Text, Image, Title } from "@mantine/core";
import { Card } from "@mantine/core";
import mealplan1 from "../../assets/mealplan1.jpg";
import mealplan2 from "../../assets/mealplan2.jpg";
import mealplan3 from "../../assets/mealplan3.jpg";
import mealplan4 from "../../assets/mealplan4.jpg";
import mealplan5 from "../../assets/mealplan5.jpg";
import mealplan6 from "../../assets/mealplan6.jpg";
import meal1 from "../../assets/meal1.jpg";
import meal2 from "../../assets/meal2.jpg";
import meal3 from "../../assets/meal3.jpg";
import { createStyles } from "@mantine/emotion";
//import { Header } from "@mantine/core";

export const MealPlanner = () => {
  const {classes} = useStyles();
    

  return (
    <Container>
      {/* <Header height = {32}>Exercises</Header> */}
      <Space h="md"/>
      <Title>Meal Planner</Title>

      <Space h="md"/>

      <div className={classes.container}>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={mealplan1}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Ford Adventures</Text>
        <Badge color="blue" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={mealplan2}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        <Badge color="blue" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={mealplan3}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        <Badge color="blue" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>
    </div>
   
    <div className={classes.container}>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={mealplan4}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        {/* <Badge color="blue" variant="light">
          New
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={mealplan5}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        {/* <Badge color="blue" variant="light">
          New
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={mealplan6}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        {/* <Badge color="blue" variant="light">
          New
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    </div>

    <div className={classes.container}>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={meal1}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        {/* <Badge color="blue" variant="light">
          New
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={meal2}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        {/* <Badge color="blue" variant="light">
          New
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={meal3}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>Norway Fjord Adventures</Text>
        {/* <Badge color="blue" variant="light">
          New
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>

    </div>
    

    </Container>
  );
};

const useStyles = createStyles (() =>{
  return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px",
        gap: "20px",
    },

  }
})