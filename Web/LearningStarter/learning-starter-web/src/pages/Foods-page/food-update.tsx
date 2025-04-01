import { FormErrors, UseForm } from "@mantine/form/lib/types";
import { ApiResponse, FoodCreateDto, FoodGetDto, FoodUpdateDto } from "../../constants/types";
import { useForm } from "@mantine/form";
import { Button, Container, Flex, NumberInput, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";

export const FoodUpdate = () => {
    const [food, setFood] = useState<FoodGetDto>();
    const navigate = useNavigate();
    const {id} = useParams();

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
        }
    });

    useEffect(() => {
        fetchFood();
        async function fetchFood() {
            const response = await api.get<ApiResponse<FoodGetDto>>(`/api/foods/${id}`);
            if (response.data.hasErrors) {
                showNotification ({message: "Error fetching food", color: "red"});
            }
            if(response.data.data) {
                setFood(response.data.data);
            }
        }
    
    },[id]);

    const submitFood = async (values: FoodCreateDto) => {
        const response = await api.put<ApiResponse<FoodGetDto>>(`/api/foods/${id}`, values);
        if (response.data.hasErrors) {

            const formErrors : FormErrors = response.data.errors.reduce((prev, curr)=> {
                Object.assign(prev, {[curr.property]: curr.message});
                return prev;
            }, {} as FormErrors
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
    }
            

    return(
        <Container>
            {food && (
            <form onSubmit={mantineForm.onSubmit(submitFood)}>
                < TextInput 
                 {...mantineForm.getInputProps("name")}
                    label="Name"
                    placeholder="Enter food name"
                    withAsterisk
                   /> 
                   < TextInput 
                 {...mantineForm.getInputProps("description")}
                    label="Descriptions"
                    placeholder="Enter food name"
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
                        <Button type="submit" >Submit</Button>
                        <Button 
                        type="button" 
                        variant="outline" 
                        color="red" 
                        ml={10} 
                        onClick={() => {navigate(routes.foods);
                        }}>
                            Cancel
                        </Button>

                    </Flex>
            </form>
            )}
        </Container>
    );
};