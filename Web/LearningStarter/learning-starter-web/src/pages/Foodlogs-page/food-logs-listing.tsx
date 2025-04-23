import { useEffect, useState } from "react";
import {
    ApiResponse,
    FoodLogGetDto,
    NutrientGetDto,
} from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import {
    Table,
    Title,
    Group,
    ActionIcon,
    Text,
    Button,
    useMantineColorScheme,
    Container,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faEdit,
    faChevronLeft,
    faChevronRight,
    faCalendarDay,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../authentication/use-auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { DateInput } from "@mantine/dates";
import { DateNavigator } from "../../components/date-nav/date-nav";


interface FoodLogWithNutrients extends FoodLogGetDto {
    nutrients: {
        protein: number;
        carbs: number;
        fat: number;
    };
}

export const FoodLogListing = ({ date, dateProp }: any) => {
    const { classes } = useStyles();
    const [logs, setLogs] = useState<FoodLogWithNutrients[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(dateProp);
    const mealTimeOrder = ["Breakfast", "Lunch", "Dinner", "Snack"];

    useEffect(() => {
        setSelectedDate(dateProp);
    }, [dateProp]);

    useEffect(() => {
        fetchLogs();
    }, [user?.id]);

    const fetchLogs = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const response = await api.get<ApiResponse<FoodLogGetDto[]>>(
                `/api/food-logs/user/${user.id}`
            );
            if (!response.data.data) {
                setLogs([]);
                return;
            }
            const logsWithNutrients = await Promise.all(
                response.data.data.map(async (log) => {
                    try {
                        const nutrientsResponse = await api.get<
                            ApiResponse<NutrientGetDto[]>
                        >(`/api/nutrients/by-food/${log.foodId}`);

                        let protein = 0;
                        let carbs = 0;
                        let fat = 0;

                        nutrientsResponse.data.data?.forEach((nutrient) => {
                            const value = nutrient.value * log.servingSize;
                            switch (nutrient.nutrientTypeName) {
                                case "Protein":
                                    protein = value;
                                    break;
                                case "Carbohydrates":
                                    carbs = value;
                                    break;
                                case "Fat":
                                    fat = value;
                                    break;
                            }
                        });

                        return {
                            ...log,
                            nutrients: {
                                protein,
                                carbs,
                                fat,
                            },
                        };
                    } catch (error) {
                        console.error(
                            `Error fetching nutrients for food ${log.foodId}:`,
                            error
                        );
                        return {
                            ...log,
                            nutrients: {
                                protein: 0,
                                carbs: 0,
                                fat: 0,
                            },
                        };
                    }
                })
            );

            setLogs(logsWithNutrients);
        } catch (error) {
            showNotification({
                message: "Error fetching food logs",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (log: FoodLogWithNutrients) => {
        navigate(routes.foodLogUpdate.replace(":id", log.id.toString()), {
            state: {
                food: {
                    id: log.foodId,
                    name: log.foodName,
                },
                userId: log.userId,
            },
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/food-logs/${id}`);
            setLogs(logs.filter((log) => log.id !== id));
            showNotification({
                message: "Log deleted successfully",
                color: "green",
            });
        } catch (error) {
            showNotification({ message: "Error deleting log", color: "red" });
        }
    };

    const dateFilteredLogs = selectedDate
        ? logs.filter((log) => {
              const logDate = new Date(log.updatedDate);
              return (
                  logDate.getFullYear() === selectedDate.getFullYear() &&
                  logDate.getMonth() === selectedDate.getMonth() &&
                  logDate.getDate() === selectedDate.getDate()
              );
          })
        : logs;

    const logsByMealTime = dateFilteredLogs.reduce(
        (groups: Record<string, FoodLogWithNutrients[]>, log) => {
            const mealTime = log.mealTime || "Other";
            if (!groups[mealTime]) {
                groups[mealTime] = [];
            }
            groups[mealTime].push(log);
            return groups;
        },
        {}
    );

    return (
        <>
            <div className={classes.log}>
                {date && (
                    <DateNavigator
                        date={selectedDate}
                        onChange={setSelectedDate}
                    />
                )}

                {/* Always display all meal times, even when empty */}
                {mealTimeOrder.map((mealTime) => {
                    const mealLogs = logsByMealTime[mealTime] || [];

                    return (
                        <div key={mealTime} className={classes.mealTimeCard}>
                            <Group justify="space-between" mb="md">
                                <Title
                                    order={3}
                                    className={classes.mealTimeTitle}
                                >
                                    {mealTime}
                                </Title>
                                <Button
                                    variant="light"
                                    color="blue"
                                    leftSection={
                                        <FontAwesomeIcon icon={faPlus} />
                                    }
                                    onClick={() =>
                                        navigate(routes.foods, {
                                            state: { mealTime },
                                        })
                                    }
                                >
                                    Add {mealTime}
                                </Button>
                            </Group>

                            {mealLogs.length > 0 ? (
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Food</Table.Th>
                                            <Table.Th>Calories</Table.Th>
                                            <Table.Th>Protein</Table.Th>
                                            <Table.Th>Carbohydrate</Table.Th>
                                            <Table.Th>Fat</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {mealLogs.map((log) => (
                                            <Table.Tr key={log.id}>
                                                <Table.Td>
                                                    <Container
                                                        p={0}
                                                        onClick={() =>
                                                            handleEdit(log)
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {log.foodName}
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                        >
                                                            {log.servingSize}{" "}
                                                            {log.servingSize ===
                                                            1
                                                                ? "serving"
                                                                : "servings"}
                                                        </Text>
                                                    </Container>
                                                </Table.Td>
                                                <Table.Td>
                                                    {log.calories}
                                                </Table.Td>
                                                <Table.Td>
                                                    {log.nutrients.protein.toFixed(
                                                        1
                                                    )}
                                                </Table.Td>
                                                <Table.Td>
                                                    {log.nutrients.carbs.toFixed(
                                                        1
                                                    )}
                                                </Table.Td>
                                                <Table.Td>
                                                    {log.nutrients.fat.toFixed(
                                                        1
                                                    )}
                                                </Table.Td>
                                                <Table.Td>
                                                    <ActionIcon
                                                        color="red"
                                                        variant="subtle"
                                                        onClick={() =>
                                                            handleDelete(log.id)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </ActionIcon>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Text c="dimmed" ta="center" py="xl">
                                    No {mealTime === "Snack" ? "snacks" : mealTime.toLowerCase()} logged yet.
                                </Text>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const useStyles = createStyles((theme) => {
    const { colorScheme } = useMantineColorScheme(); // 'light' | 'dark' | 'auto'
    return {
        log: {
            margin: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
        mealTimeCard: {
            minWidth: "70%",
            marginBottom: "20px",
            padding: "16px",
            // Adjust border color based on theme
            border: `1px solid ${
                colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors[theme.primaryColor][3]
            }`,
            borderRadius: theme.radius.md,
            // Adjust background color based on theme
            backgroundColor:
                colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            boxShadow: theme.shadows.xs,
        },
        mealTimeTitle: {
            // Title color works in both modes
            color: theme.colors[theme.primaryColor][
                colorScheme === "dark" ? 4 : 6
            ],
        },
        noLogs: {
            padding: "30px",
            textAlign: "center",
        },
    };
});
