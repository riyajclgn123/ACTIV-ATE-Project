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
} from "@mantine/core";
import { routes } from "../../routes";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { ApiResponse, ExerciseGetDto } from "../../constants/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const ExerciseUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exercise, setExercise] = useState<ExerciseGetDto>();

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        throw new Error("Invalid exercise ID");
      }

      const response = await api.get<ApiResponse<ExerciseGetDto>>(
        `/api/exercises/${id}`
      );

      if (!response.data) {
        throw new Error("No response data received");
      }

      if (response.data.hasErrors || !response.data.data) {
        throw new Error(
          response.data.errors?.join(", ") || "Exercise not found"
        );
      }

      const exerciseData = response.data.data;
      setExercise(exerciseData);
      setName(exerciseData.name);
      setDescription(exerciseData.description);
    } catch (error: any) {
      console.error("Error fetching exercise:", error);
      showNotification({
        title: "Error",
        message:
          error.response?.data?.errors?.join(", ") ||
          error.message ||
          "Failed to fetch exercise",
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

      <Button
        variant="outline"
        mb="xl"
        onClick={() => navigate(routes.exercises)}
        leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
      >
        Back to Exercises
      </Button>

      <Title order={2} mb="xl">
        Update Exercise: {exercise?.name}
      </Title>

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
          onChange={(e) => setDescription(e.currentTarget.value)}
        />

        <Group mt="xl">
          <Button onClick={handleSubmit} loading={isLoading} disabled={!name}>
            Update Exercise
          </Button>

          <Button variant="outline" onClick={() => navigate(routes.exercises)}>
            Cancel
          </Button>

          <Button color="red" onClick={handleDelete} loading={isLoading}>
            Delete Exercise
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};
