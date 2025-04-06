import { FormErrors, UseForm } from "@mantine/form/lib/types";
import { ApiResponse, FoodCreateDto, FoodGetDto } from "../../constants/types";
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

export const FoodCreate = () => {
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
        const response = await api.post<ApiResponse<FoodGetDto>>(
            "/api/foods",
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
                />
                <NumberInput
                    {...mantineForm.getInputProps("protein")}
                    label="Protein"
                    placeholder="Enter food protein"
                    withAsterisk
                    min={0}
                />
                <NumberInput
                    {...mantineForm.getInputProps("carbs")}
                    label="Carbs"
                    placeholder="Enter food carbs"
                    withAsterisk
                    min={0}
                />
                <NumberInput
                    {...mantineForm.getInputProps("fat")}
                    label="Fat"
                    placeholder="Enter food fat"
                    withAsterisk
                    min={0}
                />
                <NumberInput
                    {...mantineForm.getInputProps("fiber")}
                    label="Fiber"
                    placeholder="Enter food fiber"
                    withAsterisk
                    min={0}
                />
                <NumberInput
                    {...mantineForm.getInputProps("sugar")}
                    label="Sugar"
                    placeholder="Enter food sugar"
                    withAsterisk
                    min={0}
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
