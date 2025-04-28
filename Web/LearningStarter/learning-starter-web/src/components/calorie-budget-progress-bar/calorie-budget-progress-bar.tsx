import {
  Progress,
  Text,
  Group,
  Paper,
  useMantineColorScheme,
  Tabs,
  SimpleGrid,
  Stack,
  Badge,
  Container,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { fa0, faHeart, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CalorieBudgetProgressProps {
  consumedCalories: number;
  calorieGoal: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
}

export const CalorieBudgetProgress = ({
  consumedCalories,
  calorieGoal,
  protein = 0,
  carbs = 0,
  fat = 0,
}: CalorieBudgetProgressProps) => {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const percentage = Math.min(100, (consumedCalories / calorieGoal) * 100);
  const isOverBudget = consumedCalories > calorieGoal;
  const remainingCalories = calorieGoal - consumedCalories;
  const caloriesfromProtein = protein * 4;
  const caloriesFromCarbs = carbs * 4;
  const caloriesFromFat = fat * 9;
  const totalTrackedCalories =
    caloriesfromProtein + caloriesFromCarbs + caloriesFromFat;
  const proteinPercentage =
    totalTrackedCalories > 0
      ? (caloriesfromProtein / totalTrackedCalories) * 100
      : 0;
  const carbPercentage =
    totalTrackedCalories > 0
      ? (caloriesFromCarbs / totalTrackedCalories) * 100
      : 0;
  const fatPercentage =
    totalTrackedCalories > 0
      ? (caloriesFromFat / totalTrackedCalories) * 100
      : 0;
  const macroSections = [
    { value: proteinPercentage, label: "Protein", color: "lightblue" },
    { value: carbPercentage, label: "Carbs", color: "grape" },
    { value: fatPercentage, label: "Fat", color: "yellow" },
  ];

  return (
    <Paper
      shadow="xs"
      p="md"
      className={classes.container}
      bg={colorScheme === "dark" ? "dark.6" : "white"}
      m="0 px"
    >
      <Tabs defaultValue="Calorie Budget">
        <Tabs.List grow mb={20}>
          <Tabs.Tab
            value="Calorie Budget"
            leftSection={<FontAwesomeIcon icon={faUtensils} />}
          >
            Calorie Budget
          </Tabs.Tab>
          <Tabs.Tab
            value="Macronutrients"
            leftSection={<FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>}
          >
            Macronutrients
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Calorie Budget">
          <Group justify="apart" mb={5}>
            <Text fw={500} size="sm" c={isOverBudget ? "red" : undefined}>
              {isOverBudget ? "Over budget by:" : "Remaining:"}
            </Text>
            <Text fw={700} c={isOverBudget ? "red" : "green"}>
              {isOverBudget
                ? `${Math.abs(remainingCalories)}`
                : remainingCalories}{" "}
              calories
            </Text>
          </Group>

          {isOverBudget ? (
            // over budget → two segments: green (goal) + red (excess)
            <Progress.Root size="xl" radius="md">
              <Progress.Section
                value={(calorieGoal / consumedCalories) * 100}
                color="green"
              />
              <Progress.Section
                value={
                  ((consumedCalories - calorieGoal) / consumedCalories) * 100
                }
                color="red"
              />
            </Progress.Root>
          ) : (
            // under budget → regular single-value bar
            <Progress
              value={percentage} // 0–100
              color="green"
              size="xl"
              radius="md"
            />
          )}

          <Group justify="apart" mt={5}>
            <Text size="sm" c="dimmed">
              {consumedCalories} / {calorieGoal} kcal
            </Text>
            <Text size="sm" fw={500}>
              {percentage.toFixed(0)}%
            </Text>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="Macronutrients">
          <Stack justify="sm">
            <Group justify="apart">
              <Text fw={500}>Macronutrient Breakdown</Text>
            </Group>

            <Progress.Root size="xl" radius="md">
              {macroSections.map((section) => (
                <Progress.Section
                  key={section.label}
                  value={section.value}
                  color={section.color}
                ></Progress.Section>
              ))}
            </Progress.Root>

        
            <SimpleGrid cols={3} spacing="xs" mt={10}>
              <MacroInfo
                label="Protein"
                grams={protein}
                calories={caloriesfromProtein}
                percentage={proteinPercentage}
                color="lightblue"
              />
              <MacroInfo
                label="Carbs"
                grams={carbs}
                calories={caloriesFromCarbs}
                percentage={carbPercentage}
                color="grape"
              />
              <MacroInfo
                label="Fat"
                grams={fat}
                calories={caloriesFromFat}
                percentage={fatPercentage}
                color="yellow"
              />
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

const MacroInfo = ({
  label,
  grams,
  calories,
  percentage,
  color,
}: {
  label: string;
  grams: number;
  calories: number;
  percentage: number;
  color: string;
}) => (
  <div>
    <Group>
      <Badge color={color} size="lg" variant="filled" />
      <Container m={0} pl="xs" pr={0}>
        <Text fw={600} size="sm">
          {label}
        </Text>
        <Text size="xs">{grams.toFixed(0)}g</Text>
        <Text size="xs">{percentage.toFixed(1)}% of calories</Text>
      </Container>
    </Group>
  </div>
);

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    marginBottom: 20,
  },
}));
