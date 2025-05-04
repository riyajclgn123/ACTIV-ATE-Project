import {
  Button,
  Card,
  Group,
  Image,
  List,
  Space,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { FC } from "react";
import { createStyles } from "@mantine/emotion";

interface Meal {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  recipe: string;
}

export const MealDetail: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const meal = (state as { meal: Meal })?.meal;

  if (!meal) {
    return <Text ta="center">No meal data available.</Text>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <Space h="md" />
      <Title ta="center" order={2} c="#008b84">
        {meal.title}
      </Title>
      <Space h="md" />

      <Card shadow="md" padding="xl" radius="md" withBorder className={classes.card1}>
        <Group justify="center">
          <Image
            src={meal.image}
            alt={meal.title}
            radius="md"
            style={{ width: "100%", maxWidth: "600px" }}
          />
        </Group>

        <Space h="md" />

        <Title order={3}>Ingredients:</Title>
        <List spacing="sm" withPadding>
          {meal.ingredients.map((ingredient, index) => (
            <List.Item key={index}>{ingredient}</List.Item>
          ))}
        </List>

        <Space h="md" />

        <Title order={3}>Recipe:</Title>
        <Text size="md" mt="xs">
          {meal.recipe}
        </Text>

        <Button
          variant="outline"
          color="#52aead"
          mt="lg"
          onClick={() => navigate(-1)}
        >
          Back to Meal Plans
        </Button>
      </Card>
    </div>
  );
};

const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  return {
    card1: {
      border: `1px solid ${
        colorScheme === "dark"
          ? "#008b84"
          : theme.colors[theme.primaryColor][3]
      }`,
      
      borderRadius: theme.radius.md,
      background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              boxShadow: 
              `
                    0 4px 6px rgba(0, 0, 0, 0.1), 
                    0 8px 20px rgba(0, 0, 0, 0.2), 
                    0 12px 24px rgba(0, 0, 0, 0.15)
               `,
    }
  }});
