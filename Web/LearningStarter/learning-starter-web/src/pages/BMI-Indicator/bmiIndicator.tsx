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
  Box
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const BMIIndicator = () => {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      // Convert all units to metric (kg and m)
      let weightKg = parseFloat(weight);
      let heightM = parseFloat(height);

      if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
        throw new Error("Please enter valid weight and height");
      }

      // Convert pounds to kg if needed
      if (weightUnit === "lb") {
        weightKg = weightKg * 0.453592;
      }

      // Convert feet to cm first, then to m
      if (heightUnit === "ft") {
        heightM = heightM * 0.3048; // 1 foot = 0.3048 meters
      } else {
        // Convert cm to m
        heightM = heightM / 100;
      }

      const bmi = weightKg / (heightM * heightM);
      setBmiResult(bmi);

      showNotification({
        title: "Success",
        message: "BMI calculated successfully!",
        color: "green"
      });

    } catch (error: any) {
      console.error("Error calculating BMI:", error);
      showNotification({
        title: "Error",
        message: error.message || "Failed to calculate BMI",
        color: "red"
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
        onClick={() => window.history.back()}
        leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
      >
        Back
      </Button>

      <Title order={2} mb="xl">BMI Calculator</Title>
      
      <Card withBorder shadow="sm" p="lg">
        <Stack>
          {/* Weight Input */}
          <Group align="flex-end" grow>
            <NumberInput
              label="Weight"
              value={weight}
              onChange={(val) => setWeight(val?.toString() || "")}
              min={0}
              //precision={1}
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

          {/* Height Input */}
          <Group align="flex-end" grow>
            <NumberInput
              label="Height"
              value={height}
              onChange={(val) => setHeight(val?.toString() || "")}
              min={0}
              //precision={1}
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

          {/* Submit Button */}
          <Group mt="xl">
            <Button 
              onClick={calculateBMI}
              loading={isLoading}
              size="md"
              disabled={!weight || !height}
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
                <Text span fw={500}>BMI:</Text>{" "}
                <Text span c={bmiResult < 18.5 ? "blue" : bmiResult < 25 ? "green" : bmiResult < 30 ? "orange" : "red"} fw={700}>
                  {bmiResult.toFixed(1)} kg/m²
                </Text>
              </Text>
              <Text size="lg" mt="xs">
                Category:{" "}
                <Text span c={bmiResult < 18.5 ? "blue" : bmiResult < 25 ? "green" : bmiResult < 30 ? "orange" : "red"} fw={500}>
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