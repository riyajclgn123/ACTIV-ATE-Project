import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Space,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

import mealplan1 from "../../assets/mealplan1.jpg";
import mealplan2 from "../../assets/mealplan2.jpg";
import mealplan3 from "../../assets/mealplan3.jpg";
import mealplan4 from "../../assets/mealplan4.jpg";
import mealplan5 from "../../assets/mealplan5.jpg";
import mealplan6 from "../../assets/mealplan6.jpg";
import meal1 from "../../assets/meal1.jpg";
import meal2 from "../../assets/meal2.jpg";
import meal3 from "../../assets/meal3.jpg";

interface Meal {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  recipe: string;
}

const meals: Meal[] = [
  {
    id: 1,
    title: "High Calorie Meal",
    image: mealplan1,
    description:
      "Designed for those who need extra energy. Includes calorie-rich foods like nuts, avocados, and grains.",
    ingredients: [
      "Avocado",
      "Brown rice",
      "Chicken breast",
      "Olive oil",
      "Almonds",
    ],
    recipe:
      "Cook brown rice. Grill chicken. Mix with avocado and olive oil. Sprinkle almonds before serving.",
  },
  {
    id: 2,
    title: "High Protein Meal",
    image: mealplan2,
    description: "Boost your muscle growth with this high-protein meal plan.",
    ingredients: ["Eggs", "Salmon", "Quinoa", "Greek yogurt", "Chickpeas"],
    recipe:
      "Grill salmon. Prepare quinoa. Mix with chickpeas and top with a side of Greek yogurt.",
  },
  {
    id: 3,
    title: "High Carbohydrate Meal",
    image: mealplan3,
    description: "Fuel your energy needs with a high-carb meal.",
    ingredients: ["Pasta", "Sweet potatoes", "Bananas", "Oats", "Beans"],
    recipe:
      "Boil pasta. Roast sweet potatoes. Mix oats with bananas for dessert.",
  },
  {
    id: 4,
    title: "Balanced Meal",
    image: mealplan4,
    description: "A balanced meal with protein, carbs, and healthy fats.",
    ingredients: ["Chicken", "Brown rice", "Broccoli", "Olive oil"],
    recipe:
      "Grill chicken and broccoli. Serve with steamed brown rice and drizzle olive oil.",
  },
  {
    id: 5,
    title: "Vegetarian Meal",
    image: mealplan5,
    description: "A delicious vegetarian meal rich in fiber and nutrients.",
    ingredients: ["Tofu", "Spinach", "Chickpeas", "Sweet potatoes"],
    recipe: "Stir-fry tofu with spinach. Roast chickpeas and sweet potatoes.",
  },
  {
    id: 6,
    title: "Keto Meal",
    image: mealplan6,
    description: "Low carb, high fat meal ideal for keto diet followers.",
    ingredients: ["Avocado", "Eggs", "Bacon", "Cheese"],
    recipe: "Fry bacon and eggs. Slice avocado. Top with melted cheese.",
  },
  {
    id: 7,
    title: "Quick Meal",
    image: meal1,
    description: "Fast and easy meal under 20 minutes.",
    ingredients: ["Bread", "Peanut butter", "Banana"],
    recipe: "Spread peanut butter on bread. Top with banana slices.",
  },
  {
    id: 8,
    title: "Energy Booster",
    image: meal2,
    description: "Perfect for a pre-workout energy boost.",
    ingredients: ["Oatmeal", "Honey", "Blueberries"],
    recipe: "Prepare oatmeal. Add honey and fresh blueberries.",
  },
  {
    id: 9,
    title: "Healthy Snack",
    image: meal3,
    description: "Healthy snack option full of nutrients.",
    ingredients: ["Carrot sticks", "Hummus", "Almonds"],
    recipe: "Serve carrot sticks with hummus. Eat almonds on the side.",
  },
];

export const MealPlanner: FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handleViewRecipe = (meal: Meal) => {
    navigate(`/meal/${meal.id}`, { state: { meal } });
  };

  return (
    <div>
      <Space h="md" />
      <Space h="md" />

      <div className={classes.grid}>
        {meals.map((meal) => (
          <Card
            key={meal.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className={classes.card}
          >
            <Card.Section className={classes.cardSection}>
              <Image
                src={meal.image}
                className={classes.cardImage}
                alt={meal.title}
                radius="md"
              />
            </Card.Section>

            <div className={classes.cardContent}>
              <Group justify="space-between" mt="md" mb="xs">
                <Text size="lg" fw={600}>
                  {meal.title}
                </Text>
                <Badge color="#008b84" variant="light">
                  New
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                {meal.description}
              </Text>
              <div className={classes.cardFooter}>
                <Button
                  color="#52aead"
                  variant="outline"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => handleViewRecipe(meal)}
                >
                  Look for Ingredient and Recipes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  return {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
      margin: "30px",
    },
    card: {
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      "&:hover": {
        cursor: "pointer",
        transform: "scale(1.05)",
      },
      border: `1px solid ${
        colorScheme === "dark" ? "#008b84" : theme.colors[theme.primaryColor][3]
      }`,
      borderRadius: theme.radius.md,
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      boxShadow: `
                    0 4px 6px rgba(0, 0, 0, 0.1), 
                    0 8px 20px rgba(0, 0, 0, 0.2), 
                    0 12px 24px rgba(0, 0, 0, 0.15)
               `,
    },
    cardSection: {
      height: "250px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    cardContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    cardFooter: {
      marginTop: "auto",
      paddingTop: "16px",
    },
  };
});
