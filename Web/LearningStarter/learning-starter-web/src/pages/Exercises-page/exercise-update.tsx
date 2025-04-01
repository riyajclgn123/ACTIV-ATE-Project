import { FormErrors, UseForm } from "@mantine/form/lib/types";
import { ApiResponse, ExerciseCreateDto, ExerciseGetDto, ExerciseUpdateDto } from "../../constants/types";
import { useForm } from "@mantine/form";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";

export const ExerciseUpdate = () => {
    const [exercise, setExercise] = useState<ExerciseGetDto>();
    const navigate = useNavigate();
    const {id} = useParams();

    const mantineForm = useForm<ExerciseUpdateDto>({
        initialValues: {
            name: "",
            description: "",
        }
    });

    useEffect(() => {
        fetchExercise();
        async function fetchExercise() {
            const response = await api.get<ApiResponse<ExerciseGetDto>>(`/api/exercises/${id}`);
            if (response.data.hasErrors) {
                showNotification ({message: "Error fetching exercise", color: "red"});
            }
            if(response.data.data) {
                setExercise(response.data.data);
            }
        }
    
    },[id]);

    const submitExercise = async (values: ExerciseCreateDto) => {
        const response = await api.put<ApiResponse<ExerciseGetDto>>(`/api/exercises/${id}`, values);
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
                message: "Exercise updated successfully",
                color: "green",
            }); 
            navigate(routes.exercises);
        }
    }
            

    return(
        <Container>
            {exercise && (
            <form onSubmit={mantineForm.onSubmit(submitExercise)}>
                < TextInput 
                 {...mantineForm.getInputProps("name")}
                    label="Name"
                    placeholder="Enter exercise name"
                    withAsterisk
                   /> 
                   < TextInput 
                 {...mantineForm.getInputProps("description")}
                    label="Descriptions"
                    placeholder="Enter exercise name"
                    withAsterisk
                   /> 
                    <Space h={18} />
                    <Flex direction={"row"}>
                        <Button type="submit" >Submit</Button>
                        <Button 
                        type="button" 
                        variant="outline" 
                        color="red" 
                        ml={10} 
                        onClick={() => {navigate(routes.exercises);
                        }}>
                            Cancel
                        </Button>

                    </Flex>
            </form>
            )}
        </Container>
    );
};