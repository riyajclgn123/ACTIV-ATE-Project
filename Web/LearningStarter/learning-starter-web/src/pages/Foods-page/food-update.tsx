import { FormErrors, UseForm } from "@mantine/form/lib/types";
import {
  ApiResponse,
  FoodCreateDto,
  FoodGetDto,
  FoodUpdateDto,
} from "../../constants/types";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Space,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { createStyles } from "@mantine/emotion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export const FoodUpdate = () => {
  const [food, setFood] = useState<FoodGetDto>();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState("");

  const mantineForm = useForm<FoodUpdateDto>({
    initialValues: {
      name: "",
      description: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    },
  });

  useEffect(() => {
    fetchFood();
    async function fetchFood() {
      const response = await api.get<ApiResponse<FoodGetDto>>(
        `/api/foods/${id}`
      );
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching food", color: "red" });
      }
      if (response.data.data) {
        setFood(response.data.data);
      }
    }
  }, [id]);
  const { classes } = useStyles();
  const submitFood = async (values: FoodCreateDto) => {
    const response = await api.put<ApiResponse<FoodGetDto>>(
      `/api/foods/${id}`,
      values
    );
    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      mantineForm.setErrors(formErrors);
    }
    if (response.data.data) {
      showNotification({
        message: "Food updated successfully",
        color: "green",
      });
      navigate(routes.foods);
    }
  };
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        throw new Error("Invalid food ID");
      }

      const response = await api.delete<ApiResponse<FoodGetDto>>(
        `/api/foods/${id}`
      );

      if (response.data.hasErrors) {
        throw new Error(response.data.errors?.join(", ") || "Delete failed");
      }

      showNotification({
        title: "Success",
        message: "Food deleted successfully!",
        color: "green",
      });
      navigate(routes.exercises);
    } catch (error: any) {
      console.error("Error deleting food:", error);
      showNotification({
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete food",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !food) return <LoadingOverlay visible />;

  return (
    <Container>
      <Box maw={600} mx="auto" p="md" pos="relative">
      <Button
                variant="outline"
                mb="xl"
                color="red"
                onClick={() => navigate(routes.exercises)}
                leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                size="md"
              >
                Back to Foods
              </Button>

              <Title order={2} mb="xl">
                Update: {food?.name}
              </Title>
        <Card withBorder shadow="sm" p="lg" className={classes.card1}>
          {food && (
            <form onSubmit={mantineForm.onSubmit(submitFood)}>
            
              <TextInput
                {...mantineForm.getInputProps("name")}
                label="Name"
                placeholder="Enter food name"
                withAsterisk
                value={names}
              />
              <Space h={15} />
              <TextInput
                {...mantineForm.getInputProps("description")}
                label="Descriptions"
                placeholder="Enter food name"
                withAsterisk
              />
              <Space h={15} />
              <NumberInput
                {...mantineForm.getInputProps("calories")}
                label="Calories"
                placeholder="Enter food calories"
                withAsterisk
                min={0}
              />
              <Space h={15} />
              <NumberInput
                {...mantineForm.getInputProps("protein")}
                label="Protein"
                placeholder="Enter food protein"
                withAsterisk
                min={0}
              />
              <Space h={15} />
              <NumberInput
                {...mantineForm.getInputProps("carbs")}
                label="Carbs"
                placeholder="Enter food carbs"
                withAsterisk
                min={0}
              />
              <Space h={15} />
              <NumberInput
                {...mantineForm.getInputProps("fat")}
                label="Fat"
                placeholder="Enter food fat"
                withAsterisk
                min={0}
              />
              <Space h={15} />
              <NumberInput
                {...mantineForm.getInputProps("fiber")}
                label="Fiber"
                placeholder="Enter food fiber"
                withAsterisk
                min={0}
              />
              <Space h={15} />
              <NumberInput
                {...mantineForm.getInputProps("sugar")}
                label="Sugar"
                placeholder="Enter food sugar"
                withAsterisk
                min={0}
              />

              <Flex direction={"row"}>
                <Group mt="xl">
                  <Button
                    size="md"
                    type="submit"
                    loading={isLoading}
                    disabled={!names}
                    rightSection={<FontAwesomeIcon icon={faCheck} />}
                    color="#008b84"
                    variant="light"
                  >
                    Update {food.name}
                  </Button>

                  <Button
                    onClick={handleDelete}
                    loading={isLoading}
                    color="red"
                    variant="outline"
                    size="md"
                    rightSection={<FontAwesomeIcon icon={faTimes} />}
                  >
                    Delete {food.name}
                  </Button>
                </Group>
              </Flex>
            </form>
          )}
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
        colorScheme === "dark" ? "#008b84" : theme.colors[theme.primaryColor][3]
      }`,

      borderRadius: theme.radius.md,
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      boxShadow: `
                    0 4px 6px rgba(0, 0, 0, 0.1), 
                    0 8px 20px rgba(0, 0, 0, 0.2), 
                    0 12px 24px rgba(0, 0, 0, 0.15)
               `,
    },
  };
});
