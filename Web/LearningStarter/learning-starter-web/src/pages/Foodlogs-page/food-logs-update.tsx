import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import {
    faArrowLeft,
    faCancel,
    faCheck,
    faCross,
    faDeleteLeft,
    faHistory,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import {
    ApiResponse,
    FoodLogGetDto,
    NutrientGetDto,
} from "../../constants/types";
import { DateTimePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";

interface FoodLogResponse {
    data: {
        id: number;
        calories: number;
        servings: number;
    };
}

export const FoodLogUpdate = () => {
    const { id } = useParams();
    const { classes } = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const [servings, setServings] = useState<number>(1);
    const [mealTime, setMealTime] = useState<string>("Breakfast");
    const [unit, setUnit] = useState<string>("Servings");
    const [isLoading, setIsLoading] = useState(false);
    const [calories, setCalories] = useState<number>(0);
    const [protein, setProtein] = useState<number>(0);
    const [carbs, setCarbs] = useState<number>(0);
    const [fat, setFat] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const units = [
        { value: "Servings", label: "Servings" },
        { value: "Grams", label: "Grams" },
        { value: "Ounces", label: "Ounces" },
    ];

    const mealTimes = [
        { value: "Breakfast", label: "Breakfast" },
        { value: "Lunch", label: "Lunch" },
        { value: "Snack", label: "Snack" },
        { value: "Dinner", label: "Dinner" },
    ];

    const { food, userId } =
        (location.state as {
            food: { id: number; name: string };
            userId: number;
        }) || {};

    useEffect(() => {
        fetchFoodLog();
    }, [id]);

    const fetchFoodLog = async () => {
        setIsLoading(true);
        try {
            const response = await api.get<ApiResponse<FoodLogGetDto>>(
                `/api/food-logs/${id}`
            );
            if (response.data.hasErrors || !response.data.data) {
                throw new Error(
                    response.data.errors?.join(", ") || "Exercise log not found"
                );
            }
            const foodLog = response.data.data;
            setServings(foodLog.servingSize);
            setMealTime(foodLog.mealTime);
            setSelectedDate(new Date(foodLog.createDate));
            calculateNutrition(foodLog.servingSize, unit);
        } catch (error: any) {
            console.error("Error fetching food log:\n", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!food?.id || !userId) {
                throw new Error("Missing food or user information");
            }

            if (isNaN(servings) || servings <= 0) {
                throw new Error("Serving size must be greater than zero");
            }

            const response = await api.put<FoodLogResponse>(
                `/api/food-logs/${id}`,
                {
                    foodId: food.id,
                    userId: userId,
                    servingSize: servings,
                    calories: calories,
                    mealTime: mealTime,
                    updatedDate: selectedDate,
                }
            );

            if (response.data) {
                showNotification({
                    title: "Success",
                    message: "Food log updated successfully",
                    color: "green",
                });
                navigate(routes.foodLog);
            }
        } catch (error: any) {
            console.error("Error updating food log:", error);
            showNotification({
                title: "Error",
                message:
                    error.response?.data?.errors?.join(", ") ||
                    error.message ||
                    "Failed to update food log",
                color: "red",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const calculateNutrition = async (
        servingAmount: number,
        unitType: string
    ) => {
        try {
            const nutrients = await api.get<ApiResponse<NutrientGetDto[]>>(
                `/api/nutrients/by-food/${food.id}`
            );

            let baseCalories = 0;
            let baseProtein = 0;
            let baseCarbs = 0;
            let baseFat = 0;

            nutrients.data.data?.forEach((nutrient) => {
                if (nutrient.nutrientTypeName === "Calories") {
                    baseCalories = nutrient.value;
                }
                if (nutrient.nutrientTypeName === "Protein") {
                    baseProtein = nutrient.value;
                }
                if (nutrient.nutrientTypeName === "Carbohydrates") {
                    baseCarbs = nutrient.value;
                }
                if (nutrient.nutrientTypeName === "Fat") {
                    baseFat = nutrient.value;
                }
            });
            setCalories(baseCalories * servingAmount);
            setProtein(baseProtein * servingAmount);
            setCarbs(baseCarbs * servingAmount);
            setFat(baseFat * servingAmount);
        } catch (error) {
            console.error("Error calculating nutrition:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/food-logs/${id}`);
            showNotification({
                message: "Log deleted successfully",
                color: "green",
            });
            navigate(routes.foodLog);
        } catch (error) {
            showNotification({ message: "Error deleting log", color: "red" });
        }
    };

    return (
        <Box maw={600} mx="auto" p="md" pos="relative">
            <LoadingOverlay visible={isLoading} />
            <Container className={classes.buttonsContainer}>
                <Button
                    variant="outline"
                    color="red"
                    onClick={() => navigate(routes.foodLog)}
                    leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                >
                    Back to Food Logs
                </Button>
                <Button
                    color="red"
                    variant="outline"
                    leftSection={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => handleDelete(Number(id))}
                >
                    Delete Entry
                </Button>
            </Container>
            <Card withBorder shadow="sm" p="lg">
                <Stack>
                    {/* Duration Input */}
                    <Group align="flex-end" grow>
                        <NumberInput
                            label="Servings"
                            value={servings}
                            onChange={(value) => {
                                const newServings = Number(value) || 1;
                                setServings(newServings);
                                calculateNutrition(newServings, unit);
                            }}
                            min={1}
                            required
                        />
                        <Select
                            label="Unit"
                            value={unit}
                            onChange={(val) => {
                                const newUnit = val || "Serving";
                                setUnit(newUnit);
                                calculateNutrition(servings, newUnit);
                            }}
                            data={units}
                            required
                        />
                    </Group>

                    <Group align="flex-end" grow>
                        <Select
                            label="Meal Time"
                            value={mealTime}
                            onChange={(val) => {
                                const newMealTime = val || "Breakfast";
                                setMealTime(newMealTime);
                            }}
                            data={mealTimes}
                            required
                        />
                        <DateTimePicker
                            clearable
                            defaultValue={new Date()}
                            value={selectedDate} // Controlled value
                            onChange={setSelectedDate} // Updates state on change
                            valueFormat="DD MMM YYYY hh:mm A"
                            label="Date and Time"
                            placeholder="Pick date and time"
                        />
                    </Group>

                    {/* Nutrition Facts */}
                    <Card
                        mt="sm"
                        withBorder
                        p="lg"
                        radius="sm"
                        style={{
                            textAlign: "left",
                            fontFamily: "'Helvetica', 'Arial', sans-serif",
                        }}
                    >
                        <Title order={3} mb="xs">
                            Nutrition Facts
                        </Title>
                        <Text size="sm" c="dimmed" mb="md">
                            {food.name} ({servings} {unit})*
                        </Text>
                        <Group justify="space-between" mb="md">
                            <Text size="md" fw={700}>
                                Calories
                            </Text>
                            <Text size="md" fw={700}>
                                {Math.round(calories)}
                            </Text>
                        </Group>

                        <Group justify="space-between" my="xs">
                            <Text size="sm">Total Fat</Text>
                            <Text size="sm">{Math.round(fat)} g</Text>
                        </Group>
                        <Group justify="space-between" my="xs">
                            <Text size="sm">Total Carbohydrates</Text>
                            <Text size="sm">{Math.round(carbs)} g</Text>
                        </Group>
                        <Group justify="space-between" my="xs">
                            <Text size="sm">Protein</Text>
                            <Text size="sm">{Math.round(protein)} g</Text>
                        </Group>

                        <Group justify="space-between" mt="md">
                            <Text size="xs" c="dimmed">
                                g: grams
                            </Text>
                        </Group>
                    </Card>

                    {/* Submit Button */}
                    <Group mt="xl">
                        <Button
                            onClick={handleSubmit}
                            loading={isLoading}
                            size="md"
                            disabled={!servings || isNaN(servings)}
                            rightSection={<FontAwesomeIcon icon={faCheck} />}
                        >
                            Update {food.name}
                        </Button>
                    </Group>

                    <Text size="xs" c="dimmed" mt="xs">
                        *Nutrition values are estimates based on the food
                        database.
                    </Text>
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
