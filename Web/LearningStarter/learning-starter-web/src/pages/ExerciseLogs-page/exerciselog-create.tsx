import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NumberInput,
  Button,
  Group,
  Box,
  Text,
  Title,
  Card,
  TextInput,
  Select,
  Stack,
  LoadingOverlay,
  Container,
} from "@mantine/core";
import { routes } from "../../routes";
import api from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHistory } from "@fortawesome/free-solid-svg-icons";
import { showNotification } from "@mantine/notifications";
import { DateTimePicker } from "@mantine/dates";
import { createStyles } from "@mantine/emotion";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface ExerciseLogResponse {
  data: {
    id: number;
    caloriesBurned: number;
    duration: string;
    rep: number;
  };
}

export const ExerciseLogCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const { exercise, userId } =
    (location.state as {
      exercise: { id: number; name: string };
      userId: number;
    }) || {};

  if (!exercise?.id || !userId) {
    return (
      <Box maw={600} mx="auto" p="md">
        <Card withBorder shadow="sm" p="lg">
          <Text color="red" mb="md">
            Missing exercise or user information. Please select an exercise from
            the list.
          </Text>
          <Button
            onClick={() => navigate(routes.exercises)}
            leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Back to Exercises
          </Button>
        </Card>
      </Box>
    );
  }

  const [duration, setDuration] = useState<string>("30");
  const [durationUnit, setDurationUnit] = useState<string>("minutes");
  const [reps, setReps] = useState<number>(10);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const durationUnits = [
    { value: "seconds", label: "Seconds" },
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!exercise?.id || !userId) {
        throw new Error("Missing exercise or user information");
      }

      // Convert duration to TimeSpan format (hh:mm:ss)
      const durationValue = parseFloat(duration);
      if (isNaN(durationValue) || durationValue <= 0) {
        throw new Error("Please enter a valid duration");
      }

      const totalSeconds =
        durationUnit === "seconds"
          ? durationValue
          : durationUnit === "minutes"
          ? durationValue * 60
          : durationValue * 3600;

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      const response = await api.post<ExerciseLogResponse>(
        "/api/exercise-logs",
        {
          exerciseId: exercise.id,
          userId: userId,
          duration: formattedDuration,
          rep: reps,
          createDate: selectedDate,
        }
      );

      if (response.data?.data?.caloriesBurned) {
        setCaloriesBurned(response.data.data.caloriesBurned);
        showNotification({
          title: "Success",
          message: "Exercise logged successfully!",
          color: "green",
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error logging exercise:", error);
      showNotification({
        title: "Error",
        message:
          error.response?.data?.errors?.join(", ") ||
          error.message ||
          "Failed to log exercise",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maw={600} mx="auto" p="md" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Container className={classes.buttonsContainer}>
        <Button
          variant="outline"
          color="red"
          onClick={() => navigate(routes.exercises)}
          leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
        >
          Back to Search
        </Button>
        <Button
          onClick={() => navigate(routes.exerciseLog)}
          leftSection={<FontAwesomeIcon icon={faHistory} />}
          color="#52aead"
          variant="outline"
        >
          View My Logs
        </Button>
      </Container>

      <Title order={2} mb="xl">
        Log: {exercise.name}
      </Title>

      <Card withBorder shadow="sm" p="lg">
        <Stack>
          <Group align="flex-end" grow>
            <TextInput
              label="Duration"
              value={duration}
              onChange={(e) => setDuration(e.currentTarget.value)}
              type="number"
              min={1}
              required
            />
            <Select
              label="Unit"
              value={durationUnit}
              onChange={(val) => setDurationUnit(val || "minutes")}
              data={durationUnits}
              required
            />
          </Group>
          <NumberInput
            label="Repetitions"
            value={reps}
            onChange={(val) => setReps(Number(val) || 0)}
            min={0}
            required
          />

          <DateTimePicker
            clearable
            value={selectedDate}
            onChange={setSelectedDate}
            valueFormat="DD MMM YYYY hh:mm A"
            label="Date and Time"
            placeholder="Pick date and time"
          />

          <Group mt="xl">
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              size="md"
              disabled={!duration || isNaN(parseFloat(duration))}
              rightSection={<FontAwesomeIcon icon={faCheck} />}
                        color="#008b84"
                        variant="light"
            >
              Log {exercise.name}
            </Button>
          </Group>

          {caloriesBurned !== null && (
            <Card mt="xl" withBorder p="lg" style={{ textAlign: "center" }}>
              <Text size="xl" fw={500}>
                Exercise Summary
              </Text>
              <Text mt="sm" size="lg">
                <Text span fw={500}>
                  Calories Burned:
                </Text>{" "}
                <Text span c="green" fw={700}>
                  {caloriesBurned.toFixed(2)}
                </Text>
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Based on {duration} {durationUnit} and {reps} reps
              </Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Box>
  );
};

const useStyles = createStyles(() => {
  return {
    buttonsContainer: {
      padding: "20px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: "20px",
    },
  };
});
