import { useEffect, useState } from "react";
import {
    ApiResponse,
    ExerciseLogGetDto,
    FoodLogGetDto,
    NutrientGetDto,
} from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import {
    Button,
    Container,
    Table,
    Title,
    Group,
    ActionIcon,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../authentication/use-auth";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";

export const FoodLogListing = () => {
    const { classes } = useStyles();
    const [logs, setLogs] = useState<FoodLogGetDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [nutrients, setNutrients] = useState<NutrientGetDto[]>([]);
    const [protein, setProtein] = useState<number>(0);
    const [carbs, setCarbs] = useState<number>(0);
    const [fat, setFat] = useState<number>(0);

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
            if (response.data.data) {
                setLogs(response.data.data);
            }
        } catch (error) {
            showNotification({
                message: "Error fetching food logs",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchNutrients = async (log: FoodLogGetDto) => {
        const nutrients = await api.get<ApiResponse<NutrientGetDto[]>>(
            `/api/nutrients/by-food/${log.foodId}`
        );
        console.log("Nutrient API response:", nutrients.data);

        let baseCalories = 0;
        let baseProtein = 0;
        let baseCarbs = 0;
        let baseFat = 0;
        nutrients.data.data?.forEach((nutrient) => {
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
        const calculate = async () => {
            setProtein(baseProtein * log.servingSize);
            setCarbs(baseCarbs * log.servingSize);
            setFat(baseFat * log.servingSize);
        };
        await calculate();
    };

    const handleEdit = (log: FoodLogGetDto) => {
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

    return (
        <>
            <div className={classes.log}>
                <Title order={2} mb="md">
                    My Food Logs
                </Title>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Food</Table.Th>
                            <Table.Th>Calories</Table.Th>
                            <Table.Th>Protein</Table.Th>
                            <Table.Th>Carbohydrate</Table.Th>
                            <Table.Th>Fat</Table.Th>
                            <Table.Th>Servings</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {logs.map((log) => (
                            //fetchNutrients(log),
                            <Table.Tr key={log.id}>
                                <Table.Td>{log.foodName}</Table.Td>
                                <Table.Td>{log.calories}</Table.Td>
                                <Table.Td>{protein}</Table.Td>
                                <Table.Td>{carbs}</Table.Td>
                                <Table.Td>{fat}</Table.Td>
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
