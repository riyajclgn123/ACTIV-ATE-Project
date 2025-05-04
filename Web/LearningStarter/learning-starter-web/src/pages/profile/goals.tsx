import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NumberInput,
  Button,
  Group,
  Box,
  Title,
  Card,
  Select,
  Stack,
  LoadingOverlay,
  Container,
} from "@mantine/core";
import { routes } from "../../routes";
import api from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { useUser } from "../../authentication/use-auth";

interface GoalResponse {
  data: {
    id: number;
    value: number;
    timePeriod: number;
    type: string;
    activityLevel: string;
    createDate: string;
  };
}

export const Goals = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const currentUser = useUser();

  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [unit, setUnit] = useState<"kg" | "lb">("lb");
  const [timePeriod, setTimePeriod] = useState<number>(0);
  const [activityLevel, setActivityLevel] = useState<string>("sedentary");
  const [isLoading, setIsLoading] = useState(false);

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    {
      value: "lightly active",
      label: "Lightly active (light exercise 1-3 days/week)",
    },
    {
      value: "moderately active",
      label: "Moderately active (moderate exercise 3-5 days/week)",
    },
    {
      value: "very active",
      label: "Very active (hard exercise 6-7 days/week)",
    },
    {
      value: "extra active",
      label: "Extra active (very hard exercise & physical job)",
    },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      if (isNaN(targetWeight) || targetWeight <= 0) {
        throw new Error("Please enter a valid target weight");
      }

      if (isNaN(timePeriod) || timePeriod < 0) {
        throw new Error("Please enter a valid time period (0 or positive)");
      }

      const weightInKg = unit === "lb" ? targetWeight / 2.20462 : targetWeight;

      const response = await api.post<GoalResponse>("/api/goals", {
        userId: currentUser.id,
        value: weightInKg,
        timePeriod: timePeriod,
        type: "weight",
        activityLevel: activityLevel,
        createDate: new Date().toISOString(),
      });

      if (response.data) {
        showNotification({
          title: "Success",
          message: "Weight goal saved successfully!",
          color: "green",
        });
        navigate(routes.profile);
      }
    } catch (error: any) {
      console.error("Error saving goal:", error);
      showNotification({
        title: "Error",
        message:
          error.response?.data?.errors?.join(", ") ||
          error.message ||
          "Failed to save goal",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box style={{ paddingX: "1.2rem" }}>
      <LoadingOverlay visible={isLoading} />
      <Container className={classes.buttonsContainer}>
        <Button
          variant="outline"
          color="red"
          onClick={() => navigate(routes.home)}
          leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
        >
          Back to Dashboard
        </Button>
      </Container>

      <Title order={2} mb="xl" ta="center">
        Create Weight Goal
      </Title>

      <Card withBorder shadow="sm" className={classes.innerCard}>
        <Stack align="center">
          <Box className={classes.inputGroup}>
            <NumberInput
              label={`Target Weight (${unit})`}
              value={targetWeight}
              onChange={(val) => setTargetWeight(Number(val))}
              min={0}
              step={0.1}
              required
            />
            <Select
              label="Unit"
              value={unit}
              onChange={(val) => setUnit((val as "kg" | "lb") || "lb")}
              data={[
                { value: "lb", label: "Pounds (lb)" },
                { value: "kg", label: "Kilograms (kg)" },
              ]}
              required
            />
          </Box>

          <NumberInput
            label="Time Period (days)"
            description="0 means no specific time frame"
            value={timePeriod}
            onChange={(val) => setTimePeriod(Number(val))}
            min={0}
            required
            className={classes.centeredInput}
          />

          <Select
            label="Activity Level"
            value={activityLevel}
            onChange={(val) => setActivityLevel(val || "sedentary")}
            data={activityLevels}
            required
            className={classes.centeredInput}
          />

          <Group mt="xl">
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              size="md"
              disabled={!targetWeight || isNaN(targetWeight)}
              rightSection={<FontAwesomeIcon icon={faBullseye} />}
              color="#008b84"
              variant="light"
            >
              Save Goal
            </Button>
          </Group>
        </Stack>
      </Card>
    </Box>
  );
};

const useStyles = createStyles((theme) => ({
  buttonsContainer: {
    padding: "20px",
    display: "flex",
  },
  outerCard: {
    //padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCard: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    //border: "1px solid #e0e0e0",
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    maxWidth: "600px",
    margin: "0 auto",
  },
  inputGroup: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-end",
    width: "100%",
    justifyContent: "center",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  centeredInput: {
    width: "100%",
    maxWidth: "400px",
  },
}));
