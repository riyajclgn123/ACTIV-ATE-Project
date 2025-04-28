import { Button, Card, Group, Image, List, Space, Text, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { FC } from "react";

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
  const meal = (state as { meal: Meal })?.meal;

  if (!meal) {
    return <Text ta="center">No meal data available.</Text>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <Space h="md" />
      <Title ta="center" order={2} c="blue.7">
        {meal.title}
      </Title>
      <Space h="md" />

      <Card shadow="md" padding="xl" radius="md" withBorder>
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
          color="blue"
          fullWidth
          mt="lg"
          onClick={() => navigate(-1)}
        >
          Back to Meal Plans
        </Button>
      </Card>
    </div>
  );
};
