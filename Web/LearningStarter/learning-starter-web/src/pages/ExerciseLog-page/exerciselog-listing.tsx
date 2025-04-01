import { useEffect, useState } from "react";
import { ApiResponse, ExerciseLogGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { Button, Container, Table, Title, Group, ActionIcon } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../authentication/use-auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const ExerciseLogListing = () => {
    const [logs, setLogs] = useState<ExerciseLogGetDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLogs();
    }, [user?.id]);

    const fetchLogs = async () => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            const response = await api.get<ApiResponse<ExerciseLogGetDto[]>>(`/api/exercise-logs/user/${user.id}`);
            if (response.data.data) {
                setLogs(response.data.data);
            }
        } catch (error) {
            showNotification({ message: "Error fetching exercise logs", color: "red" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/exercise-logs/${id}`);
            setLogs(logs.filter(log => log.id !== id));
            showNotification({ message: "Log deleted successfully", color: "green" });
        } catch (error) {
            showNotification({ message: "Error deleting log", color: "red" });
        }
    };

    return (
        <Container>
            <Title order={2} mb="md">Your Exercise Logs</Title>
            <Table striped highlightOnHover>
                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Duration</th>
                        <th>Reps</th>
                        <th>Calories</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td>{log.exerciseName}</td>
                            <td>{log.duration}</td>
                            <td>{log.rep}</td>
                            <td>{log.caloriesBurned.toFixed(2)}</td>
                            <td>{new Date(log.createDate).toLocaleDateString()}</td>
                            <td>
                                <Group>
                                    <ActionIcon 
                                        color="blue" 
                                        onClick={() => navigate(routes.exerciseLogUpdate.replace(":id", log.id.toString()))}
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};