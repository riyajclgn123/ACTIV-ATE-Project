import { useEffect, useState } from "react";
import {
    ApiResponse,
    FoodLogGetDto,
    NutrientGetDto,
} from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { Table, Title, Group, ActionIcon } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faEdit,
    faChevronLeft,
    faChevronRight,
    faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../authentication/use-auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { DateInput } from "@mantine/dates";
import { DateNavigator } from "../../constants/theme-constants";

interface FoodLogWithNutrients extends FoodLogGetDto {
    nutrients: {
        protein: number;
        carbs: number;
        fat: number;
    };
}

export const FoodLogListing = ({date, dateProp}: any) => {
    const { classes } = useStyles();
    const [logs, setLogs] = useState<FoodLogWithNutrients[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(dateProp);

    useEffect(() => {
        setSelectedDate(dateProp);
    }
    , [dateProp]);

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

    const filteredLogs = selectedDate
        ? logs.filter((log) => {
              const logDate = new Date(log.updatedDate);
              return (
                  logDate.getFullYear() === selectedDate.getFullYear() &&
                  logDate.getMonth() === selectedDate.getMonth() &&
                  logDate.getDate() === selectedDate.getDate()
              );
          })
        : logs;

    return (
        <>
            <div className={classes.log}>
                {date && <DateNavigator date={selectedDate} onChange={setSelectedDate} />} 
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Food</Table.Th>
                            <Table.Th>Calories</Table.Th>
                            <Table.Th>Meal Time</Table.Th>
                            <Table.Th>Protein</Table.Th>
                            <Table.Th>Carbohydrate</Table.Th>
                            <Table.Th>Fat</Table.Th>
                            <Table.Th>Servings</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredLogs.map((log) => (
                            <Table.Tr key={log.id}>
                                <Table.Td>{log.foodName}</Table.Td>
                                <Table.Td>{log.calories}</Table.Td>
                                <Table.Td>{log.mealTime}</Table.Td>
                                <Table.Td>
                                    {log.nutrients.protein.toFixed(1)}
                                </Table.Td>
                                <Table.Td>
                                    {log.nutrients.carbs.toFixed(1)}
                                </Table.Td>
                                <Table.Td>
                                    {log.nutrients.fat.toFixed(1)}
                                </Table.Td>
                                <Table.Td>{log.servingSize}</Table.Td>
                                <Table.Td>
                                    <Group>
                                        <ActionIcon
                                            color="blue"
                                            onClick={() => handleEdit(log)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="red"
                                            onClick={() => handleDelete(log.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
        </>
    );
};

const useStyles = createStyles(() => {
    return {
        log: {
            margin: "20px",
        },
    };
});
