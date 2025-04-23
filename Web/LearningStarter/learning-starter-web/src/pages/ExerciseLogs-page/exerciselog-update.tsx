import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { ApiResponse, ExerciseLogGetDto } from "../../constants/types";
import { DateTimePicker } from "@mantine/dates";
import { createStyles } from "@mantine/emotion";

interface ExerciseLogResponse {
    data: {
        id: number;
        caloriesBurned: number;
        duration: string;
        rep: number;
        exerciseName: string;
    };
}

export const ExerciseLogUpdate = () => {
    const location = useLocation();
    const locationState = location.state || {};
    const { exercise, userId } = locationState as {
        exercise?: { id: number; name: string };
        userId?: number;
    };
    const { id } = useParams();
    const navigate = useNavigate();
    const { classes } = useStyles();
    const [duration, setDuration] = useState<string>("");
    const [durationUnit, setDurationUnit] = useState<string>("minutes");
    const [reps, setReps] = useState<number>(0);
    const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [exerciseName, setExerciseName] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const durationUnits = [
        { value: "seconds", label: "Seconds" },
        { value: "minutes", label: "Minutes" },
        { value: "hours", label: "Hours" },
    ];

    useEffect(() => {
        fetchLog();
    }, [id]);

    const fetchLog = async () => {
        setIsLoading(true);
        try {
            if (!id) {
                throw new Error("Invalid exercise log ID");
            }

            const response = await api.get<ApiResponse<ExerciseLogGetDto>>(
                `/api/exercise-logs/${id}`
            );

            if (!response.data) {
                throw new Error("No response data received");
            }

            // Check for API errors
            if (response.data.hasErrors || !response.data.data) {
                throw new Error(
                    response.data.errors?.join(", ") || "Exercise log not found"
                );
            }
            const logData = response.data.data;
            setExerciseName(logData.exerciseName);

            if (typeof logData.duration !== "string") {
                throw new Error("Invalid duration format received from server");
            }

            // Now TypeScript knows duration is a string
            const [hours, minutes, seconds] = logData.duration
                .split(":")
                .map(Number);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            setDuration(totalSeconds.toString());

            setReps(logData.rep);
            setCaloriesBurned(logData.caloriesBurned);
        } catch (error: any) {
            console.error("Error fetching exercise log:", error);
            showNotification({
                title: "Error",
                message:
                    error.response?.data?.errors?.join(", ") ||
                    error.message ||
                    "Failed to fetch log",
                color: "red",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Validate inputs
            if (!id) {
                throw new Error("Invalid exercise log ID");
            }
            if (!exercise || !userId) {
                throw new Error("Exercise or User ID is missing");
            }

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

            const formattedDuration = `${hours
                .toString()
                .padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

            try {
                const checkResponse = await api.get(`/api/exercise-logs/${id}`);
                if (checkResponse.status !== 200) {
                    throw new Error("Exercise log not found");
                }
            } catch (error) {
                throw new Error(
                    "Failed to verify exercise log before updating."
                );
            }

            // 2. Then make the update request
            const response = await api.put<ExerciseLogResponse>(
                `/api/exercise-logs/${id}`,
                {
                    exerciseId: exercise.id,
                    userId: userId,
                    duration: formattedDuration,
                    rep: reps,
                    updatedDate: selectedDate,
                }
            );

            if (response.status !== 200) {
                throw new Error(`Update failed with status ${response.status}`);
            }
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Update failed with status ${response.status}`);
            }

            showNotification({
                title: "Success",
                message: "Exercise log updated successfully!",
                color: "green",
            });
            navigate(routes.exerciseLog);
        } catch (error: any) {
            console.error("Error updating exercise:", error);
            showNotification({
                title: "Error",
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to update exercise log",
                color: "red",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !exerciseName) return <LoadingOverlay visible />;

    return (
        <Box maw={600} mx="auto" p="md" pos="relative">
            <LoadingOverlay visible={isLoading} />
            <Container className={classes.buttonsContainer}>
                <Button
                    variant="outline"
                    color="red"
                    onClick={() => navigate(routes.exerciseLog)}
                    leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                >
                    Back to Logs
                </Button>
                <Button
                    onClick={() => navigate(routes.exerciseLog)}
                    leftSection={<FontAwesomeIcon icon={faHistory} />}
                >
                    View My Logs
                </Button>
            </Container>

            <Title order={2} mb="xl">
                Update Exercise: {exerciseName}
            </Title>

            <Card withBorder shadow="sm" p="lg">
                <Stack>
                    {/* Duration Input */}
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
                            onChange={(val) =>
                                setDurationUnit(val || "minutes")
                            }
                            data={durationUnits}
                            required
                        />
                    </Group>

                    {/* Reps Input */}
                    <NumberInput
                        label="Repetitions"
                        value={reps}
                        onChange={(val) => setReps(Number(val) || 0)}
                        min={0}
                        required
                    />

                    <DateTimePicker
                        defaultValue={new Date()}
                        value={selectedDate} // Controlled value
                        onChange={setSelectedDate} // Updates state on change
                        valueFormat="DD MMM YYYY hh:mm A"
                        label="Pick date and time"
                        placeholder="Pick date and time"
                    />

                    {/* Submit Button */}
                    <Group mt="xl">
                        <Button
                            onClick={handleSubmit}
                            loading={isLoading}
                            size="md"
                            disabled={!duration || isNaN(parseFloat(duration))}
                        >
                            Update Log
                        </Button>
                    </Group>

                    {caloriesBurned !== null && (
                        <Card
                            mt="xl"
                            withBorder
                            p="lg"
                            style={{ textAlign: "center" }}
                        >
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
                                Based on {duration} {durationUnit} and {reps}{" "}
                                reps
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
