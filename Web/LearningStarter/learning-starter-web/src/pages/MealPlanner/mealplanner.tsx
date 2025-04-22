
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
    <div >
      {/* <Header height = {32}>Exercises</Header> */}
      <Space h="md"/>
      <Title  style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize:"50px",
        fontWeight: 500,
        color: "#4263f5",

      }}>
        
        Meal Plans
        
      </Title>

      <Space h="md"/>

      <div className={classes.container}>

      <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={mealplan1}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>High Calorie Meal</Text>
        <Badge color="blue" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Look for Ingredient and Recipes
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={mealplan2}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>High Protein Meal</Text>
        <Badge color="blue" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
      Look for Ingredient and Recipes
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={mealplan3}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
        />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text size="lg" fw={500}>High Carbohydrate Meal</Text>
        <Badge color="blue" variant="light">
          New
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
      Look for Ingredient and Recipes
      </Button>
    </Card>
    </div>
   
    <div className={classes.container}>
    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={mealplan4}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
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
      Look for Ingredient and Recipes
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={mealplan5}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
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
      Look for Ingredient and Recipes
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={mealplan6}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
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
      Look for Ingredient and Recipes
      </Button>
    </Card>

    </div>

    <div className={classes.container}>
    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={meal1}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
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
      Look for Ingredient and Recipes
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section>
        <Image
          src={meal2}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
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
      Look for Ingredient and Recipes
      </Button>
    </Card>

    <Card shadow="sm" padding="lg" radius="md" withBorder  className={classes.card}>
      <Card.Section>
        <Image
          src={meal3}
          height={600}
          width="100%"
          fit="fill"
          alt="Norway"
           radius="md"
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
      Look for Ingredient and Recipes
      </Button>
    </Card>

    </div>
    

    </div>
  );
};

const useStyles = createStyles (() =>{
  return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "30px",
        gap: "50px",
    },
    card:{
      
      "&:hover": {
        cursor: "pointer",
        //boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        transform: "scale(1.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      },
    }

  }
})