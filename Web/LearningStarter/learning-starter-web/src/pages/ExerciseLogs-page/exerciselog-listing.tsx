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
import { createStyles } from "@mantine/emotion";
import { DateNavigator } from "../../constants/theme-constants";

export const ExerciseLogListing = ({date, dateProp}: any) => {
    const { classes } = useStyles();
    const [logs, setLogs] = useState<ExerciseLogGetDto[]>([]);
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

    const handleEdit = (log: ExerciseLogGetDto) => {

        navigate(
            routes.exerciseLogUpdate.replace(":id", log.id.toString()),
            {
                state: {
                    exercise: { 
                        id: log.exerciseId, 
                        name: log.exerciseName 
                    },
                    userId: log.userId
                }
            }
        );
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
                        <Table.Th>Exercise</Table.Th>
                        <Table.Th>Calories Burned</Table.Th>
                        <Table.Th>Duration</Table.Th>
                        <Table.Th>Reps</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {filteredLogs.map(log => (
                        <Table.Tr key={log.id}>
                            <Table.Td>{log.exerciseName}</Table.Td>
                            <Table.Td>{log.caloriesBurned.toFixed(2)}</Table.Td>
                            <Table.Td>{log.duration}</Table.Td>
                            <Table.Td>{log.rep}</Table.Td>

                            
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
      log:{
        margin: "20px",
      },
  
  
    };
  });
  