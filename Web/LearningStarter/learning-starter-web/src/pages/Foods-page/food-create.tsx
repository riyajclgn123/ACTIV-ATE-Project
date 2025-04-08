import { FormErrors, UseForm } from "@mantine/form/lib/types";
import {
    ApiResponse,
    FoodCreateDto,
    FoodGetDto,
    NutrientGetDto,
} from "../../constants/types";
import { useForm } from "@mantine/form";
import {
    Button,
    Container,
    Flex,
    NumberInput,
    Space,
    TextInput,
} from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";

export const FoodCreate = () => {
    const [calories, setCalories] = useState<number>(0);
    const [protein, setProtein] = useState<number>(0);
    const [carbs, setCarbs] = useState<number>(0);
    const [fat, setFat] = useState<number>(0);
    const [fiber, setFiber] = useState<number>(0);
    const [sugar, setSugar] = useState<number>(0);

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
        const foodResponse = await api.post<ApiResponse<FoodGetDto>>(
            "/api/foods",
            {
                name: values.name,
                description: values.description,
            }
        );

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
            <form onSubmit={mantineForm.onSubmit(submitFood)}>
                <TextInput
                    {...mantineForm.getInputProps("name")}
                    label="Name"
                    placeholder="Enter food name"
                    withAsterisk
                />
                <TextInput
                    {...mantineForm.getInputProps("description")}
                    label="Description"
                    placeholder="Enter food description"
                    withAsterisk
                />
                <NumberInput
                    {...mantineForm.getInputProps("calories")}
                    label="Calories"
                    placeholder="Enter food calories"
                    withAsterisk
                    min={0}
                    onChange={(value) => setCalories(Number(value) || 0)}
                />
                <NumberInput
                    {...mantineForm.getInputProps("protein")}
                    label="Protein"
                    placeholder="Enter food protein"
                    withAsterisk
                    min={0}
                    onChange={(value) => setProtein(Number(value) || 0)}
                />
                <NumberInput
                    {...mantineForm.getInputProps("carbs")}
                    label="Carbs"
                    placeholder="Enter food carbs"
                    withAsterisk
                    min={0}
                    onChange={(value) => setCarbs(Number(value) || 0)}
                />
                <NumberInput
                    {...mantineForm.getInputProps("fat")}
                    label="Fat"
                    placeholder="Enter food fat"
                    withAsterisk
                    min={0}
                    onChange={(value) => setFat(Number(value) || 0)}
                />
                <NumberInput
                    {...mantineForm.getInputProps("fiber")}
                    label="Fiber"
                    placeholder="Enter food fiber"
                    withAsterisk
                    min={0}
                    onChange={(value) => setFiber(Number(value) || 0)}
                />
                <NumberInput
                    {...mantineForm.getInputProps("sugar")}
                    label="Sugar"
                    placeholder="Enter food sugar"
                    withAsterisk
                    min={0}
                    onChange={(value) => setSugar(Number(value) || 0)}
                />
                <Space h={18} />
                <Flex direction={"row"}>
                    <Button type="submit">Submit</Button>
                    <Button
                        type="button"
                        variant="outline"
                        color="red"
                        ml={10}
                        onClick={() => {
                            navigate(routes.foods);
                        }}
                    >
                        Cancel
                    </Button>
                </Flex>
            </form>
        </Container>
    );
};