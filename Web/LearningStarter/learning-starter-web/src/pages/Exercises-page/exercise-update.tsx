import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextInput,
  LoadingOverlay,
  Title,
  Stack,
  Group,
  useMantineColorScheme,
  Card,
  Box,
} from "@mantine/core";
import { routes } from "../../routes";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { ApiResponse, ExerciseGetDto } from "../../constants/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { createStyles } from "@mantine/emotion";
import { FormErrors, UseForm } from "@mantine/form/lib/types";

export const ExerciseUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exercise, setExercise] = useState<ExerciseGetDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("Invalid exercise ID");
      }

      const response = await api.get<ApiResponse<ExerciseGetDto>>(
        `/api/exercises/${id}`
      );

      if (response.data.hasErrors || !response.data.data) {
        const errorMessage = response.data.errors?.join(", ") || "Exercise not found";
        setError(errorMessage);
        showNotification({
          title: "Error",
          message: errorMessage,
          color: "red",
        });
        return;
      }

      const exerciseData = response.data.data;
      setExercise(exerciseData);
      setName(exerciseData.name);
      setDescription(exerciseData.description);
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.join(", ") || 
                         error.message || 
                         "Failed to fetch exercise";
      setError(errorMessage);
      console.error("Error fetching exercise:", error);
      showNotification({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        throw new Error("Invalid exercise ID");
      }

      if (!name) {
        throw new Error("Name is required");
      }

      const response = await api.put<ApiResponse<ExerciseGetDto>>(
        `/api/exercises/${id}`,
        {
          name,
          description,
        }
      );

      if (response.data.hasErrors || !response.data.data) {
        throw new Error(response.data.errors?.join(", ") || "Update failed");
      }

      showNotification({
        title: "Success",
        message: "Exercise updated successfully!",
        color: "green",
      });
      navigate(routes.exercises);
    } catch (error: any) {
      console.error("Error updating exercise:", error);
      showNotification({
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update exercise",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const { classes } = useStyles();
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        throw new Error("Invalid exercise ID");
      }

      const response = await api.delete<ApiResponse<ExerciseGetDto>>(
        `/api/exercises/${id}`
      );

      if (response.data.hasErrors) {
        throw new Error(response.data.errors?.join(", ") || "Delete failed");
      }

      showNotification({
        title: "Success",
        message: "Exercise deleted successfully!",
        color: "green",
      });
      navigate(routes.exercises);
    } catch (error: any) {
      console.error("Error deleting exercise:", error);
      showNotification({
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete exercise",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !exercise) return <LoadingOverlay visible />;
  

  return (
    <Container size="md" p="md" pos="relative">
      <LoadingOverlay visible={isLoading} />
        <Box maw={600} mx="auto" p="md" pos="relative">
        <Button
        variant="outline"
        mb="xl"
        color="red"
        onClick={() => navigate(routes.exercises)}
        leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
        size="md"
      >
        Back to Exercises
      </Button>

      <Title order={2} mb="xl">
        
      {`Update: ${name || "Exercise"}`}
      </Title>
              <Card withBorder shadow="sm" p="lg" className={classes.card1}>
              <form >

      

      <Stack>
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
          withAsterisk
        />

        <TextInput
          label="Description"
          value={description}
          required
          withAsterisk
          onChange={(e) => setDescription(e.currentTarget.value)}
        />

        <Group mt="xl">
          <Button onClick={handleSubmit} loading={isLoading} disabled={!name} size="md"
                                  rightSection={<FontAwesomeIcon icon={faCheck} />}
                                            color="#008b84"
                                            variant="light" >
             {`Update ${name || "Exercise"}`}
          </Button>

          <Button 
          color="red" 
          onClick={handleDelete} 
          loading={isLoading} 
          variant="outline" 
          size="md" 
          rightSection={<FontAwesomeIcon icon={faTimes} />}
          >
             {`Delete ${name || "Exercise"}`}
          </Button>
        </Group>
      </Stack>
      </form>
      </Card>
      </Box>
    </Container>
  );
};


const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return {
    card1: {
      border: `1px solid ${
        colorScheme === "dark"
          ? "#008b84"
          : theme.colors[theme.primaryColor][3]
      }`,
      
      borderRadius: theme.radius.md,
      background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              boxShadow: 
              `
                    0 4px 6px rgba(0, 0, 0, 0.1), 
                    0 8px 20px rgba(0, 0, 0, 0.2), 
                    0 12px 24px rgba(0, 0, 0, 0.15)
               `,
    },
  }
});
