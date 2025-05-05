import { FormErrors, UseForm } from "@mantine/form/lib/types";
import {
  ApiResponse,
  FoodCreateDto,
  FoodGetDto,
  NutrientGetDto,
} from "../../constants/types";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  NumberInput,
  Space,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCross, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { createStyles } from "@mantine/emotion";

export const FoodCreate = () => {
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [fiber, setFiber] = useState<number>(0);
  const [sugar, setSugar] = useState<number>(0);
  const { classes } = useStyles();

  const navigate = useNavigate();
  const mantineForm = useForm<FoodCreateDto>({
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
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      calories: (value) =>
        value < 0 ? "Calories must be a positive number" : null,
    },
  });

  const submitFood = async (values: FoodCreateDto) => {
    const foodResponse = await api.post<ApiResponse<FoodGetDto>>("/api/foods", {
      name: values.name,
      description: values.description,
    });

    const postNutrients = async () => {
      api.post<ApiResponse<NutrientGetDto>>("/api/nutrients", {
        Unit: "g",
        Value: calories,
        FoodId: foodResponse.data.data?.id,
        NutrientTypeId: 1,
      });
      api.post<ApiResponse<NutrientGetDto>>("/api/nutrients", {
        Unit: "g",
        Value: protein,
        FoodId: foodResponse.data.data?.id,
        NutrientTypeId: 2,
      });
      api.post<ApiResponse<NutrientGetDto>>("/api/nutrients", {
        Unit: "g",
        Value: carbs,
        FoodId: foodResponse.data.data?.id,
        NutrientTypeId: 3,
      });
      api.post<ApiResponse<NutrientGetDto>>("/api/nutrients", {
        Unit: "g",
        Value: sugar,
        FoodId: foodResponse.data.data?.id,
        NutrientTypeId: 4,
      });
      api.post<ApiResponse<NutrientGetDto>>("/api/nutrients", {
        Unit: "g",
        Value: fiber,
        FoodId: foodResponse.data.data?.id,
        NutrientTypeId: 5,
      });
      api.post<ApiResponse<NutrientGetDto>>("/api/nutrients", {
        Unit: "g",
        Value: fat,
        FoodId: foodResponse.data.data?.id,
        NutrientTypeId: 6,
      });
    };
    await postNutrients();

    if (foodResponse.data.hasErrors) {
      const formErrors: FormErrors = foodResponse.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      mantineForm.setErrors(formErrors);
    }

    if (foodResponse.data.data) {
      showNotification({
        message: "Food created successfully",
        color: "green",
      });
      navigate(routes.foods);
    }
  };

  return (
    <Container>
        <Box maw={600} mx="auto" p="md" pos="relative">
              <Card withBorder shadow="sm" p="lg" className={classes.card1}>
      <form onSubmit={mantineForm.onSubmit(submitFood)}>
        <TextInput
          {...mantineForm.getInputProps("name")}
          label="Name"
          placeholder="Enter food name"
          withAsterisk
        />
         <Space h={18} />
        <TextInput
          {...mantineForm.getInputProps("description")}
          label="Description"
          placeholder="Enter food description"
          withAsterisk
        />
         <Space h={18} />
        <NumberInput
          {...mantineForm.getInputProps("calories")}
          label="Calories"
          placeholder="Enter food calories"
          withAsterisk
          min={0}
          onChange={(value) => setCalories(Number(value) || 0)}
        />
         <Space h={18} />
        <NumberInput
          {...mantineForm.getInputProps("protein")}
          label="Protein"
          placeholder="Enter food protein"
          withAsterisk
          min={0}
          onChange={(value) => setProtein(Number(value) || 0)}
        />
         <Space h={18} />
        <NumberInput
          {...mantineForm.getInputProps("carbs")}
          label="Carbs"
          placeholder="Enter food carbs"
          withAsterisk
          min={0}
          onChange={(value) => setCarbs(Number(value) || 0)}
        />
         <Space h={18} />
        <NumberInput
          {...mantineForm.getInputProps("fat")}
          label="Fat"
          placeholder="Enter food fat"
          withAsterisk
          min={0}
          onChange={(value) => setFat(Number(value) || 0)}
        />
         <Space h={18} />
        <NumberInput
          {...mantineForm.getInputProps("fiber")}
          label="Fiber"
          placeholder="Enter food fiber"
          withAsterisk
          min={0}
          onChange={(value) => setFiber(Number(value) || 0)}
        />
         <Space h={18} />
        <NumberInput
          {...mantineForm.getInputProps("sugar")}
          label="Sugar"
          placeholder="Enter food sugar"
          withAsterisk
          min={0}
          onChange={(value) => setSugar(Number(value) || 0)}
        />
        <Space h={25} />
        <Flex direction={"row"}>
          <Button 
          type="submit"
          size="md"
           rightSection={<FontAwesomeIcon icon={faCheck} />}
                                            color="#008b84"
                                            variant="light" 
          >
            Submit
            </Button>

          <Button
            type="button"
            variant="outline"
            color="red"
            size="md"
            ml={10}
            onClick={() => {
              navigate(routes.foods);
            }}
            rightSection={<FontAwesomeIcon icon={faTimes} />}
          >
            Cancel
          </Button>
        </Flex>
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
