import { useState } from "react";
import {
  NumberInput,
  Button,
  Group,
  Text,
  Title,
  Card,
  Select,
  Stack,
  LoadingOverlay,
  Box,
  useMantineColorScheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalculator } from "@fortawesome/free-solid-svg-icons";
import { createStyles } from "@mantine/emotion";

export const BMIIndicator = () => {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { classes } = useStyles();

  const weightUnits = [
    { value: "kg", label: "Kilograms" },
    { value: "lb", label: "Pounds" },
  ];

  const heightUnits = [
    { value: "cm", label: "Centimeters" },
    { value: "ft", label: "Feet" },
  ];

  const calculateBMI = () => {
    setIsLoading(true);
    try {
      let weightKg = parseFloat(weight);
      let heightM = parseFloat(height);

      if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
        throw new Error("Please enter valid weight and height");
      }

      if (weightUnit === "lb") {
        weightKg = weightKg * 0.453592;
      }

      if (heightUnit === "ft") {
        heightM = heightM * 0.3048;
      } else {
        heightM = heightM / 100;
      }

      const bmi = weightKg / (heightM * heightM);
      setBmiResult(bmi);

      showNotification({
        title: "Success",
        message: "BMI calculated successfully!",
        color: "green",
      });
    } catch (error: any) {
      console.error("Error calculating BMI:", error);
      showNotification({
        title: "Error",
        message: error.message || "Failed to calculate BMI",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <Box maw={600} mx="auto" p="md" pos="relative">
      <LoadingOverlay visible={isLoading} />

      <Button
        variant="outline"
        mb="xl"
        color="red"
        onClick={() => window.history.back()}
        leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
      >
        Back
      </Button>

      <Card withBorder shadow="sm" p="lg" className={classes.card1}>
        <Title order={2} mb="xl">
          <FontAwesomeIcon icon={faCalculator}  /> BMI Calculator
        </Title>
        <Stack>
          <Group align="flex-end" grow>
            <NumberInput
              label="Weight"
              value={weight}
              onChange={(val) => setWeight(val?.toString() || "")}
              min={0}
              required
            />
            <Select
              label="Unit"
              value={weightUnit}
              onChange={(val) => setWeightUnit(val || "kg")}
              data={weightUnits}
              required
            />
          </Group>
          <Group align="flex-end" grow>
            <NumberInput
              label="Height"
              value={height}
              onChange={(val) => setHeight(val?.toString() || "")}
              min={0}
              required
            />
            <Select
              label="Unit"
              value={heightUnit}
              onChange={(val) => setHeightUnit(val || "cm")}
              data={heightUnits}
              required
            />
          </Group>
          <Group mt="xl">
            <Button
              onClick={calculateBMI}
              loading={isLoading}
              size="md"
              disabled={!weight || !height}
              color="#008b84"
              variant="light"
            >
              Calculate BMI
            </Button>
          </Group>

          {bmiResult !== null && (
            <Card mt="xl" withBorder p="lg" style={{ textAlign: "center" }}>
              <Text size="xl" fw={500}>
                Your BMI Result
              </Text>
              <Text mt="sm" size="lg">
                <Text span fw={500}>
                  BMI:
                </Text>{" "}
                <Text
                  span
                  c={
                    bmiResult < 18.5
                      ? "blue"
                      : bmiResult < 25
                      ? "green"
                      : bmiResult < 30
                      ? "orange"
                      : "red"
                  }
                  fw={700}
                >
                  {bmiResult.toFixed(1)} kg/m²
                </Text>
              </Text>
              <Text size="lg" mt="xs">
                Category:{" "}
                <Text
                  span
                  c={
                    bmiResult < 18.5
                      ? "blue"
                      : bmiResult < 25
                      ? "green"
                      : bmiResult < 30
                      ? "orange"
                      : "red"
                  }
                  fw={500}
                >
                  {getBmiCategory(bmiResult)}
                </Text>
              </Text>

              <Text size="sm" c="dimmed" mt="xs">
                Based on {weight} {weightUnit} and {height} {heightUnit}
              </Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Box>
  );
};

const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

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
    },
  }
});
