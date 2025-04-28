import { FormErrors } from "@mantine/form/lib/types";
import {
  ApiResponse,
  ExerciseCreateDto,
  ExerciseGetDto,
} from "../../constants/types";
import { useForm } from "@mantine/form";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";

export const ExerciseCreate = () => {
  const navigate = useNavigate();
  const mantineForm = useForm<ExerciseCreateDto>({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const submitExercise = async (values: ExerciseCreateDto) => {
    const response = await api.post<ApiResponse<ExerciseGetDto>>(
      "/api/exercises",
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
        message: "Exercise created successfully",
        color: "green",
      });
      navigate(routes.exercises);
    }
  };

  return (
    <Container>
      <form onSubmit={mantineForm.onSubmit(submitExercise)}>
        <TextInput
          {...mantineForm.getInputProps("name")}
          label="Name"
          placeholder="Enter exercise name"
          withAsterisk
        />
        <TextInput
          {...mantineForm.getInputProps("description")}
          label="Descriptions"
          placeholder="Enter exercise description"
          withAsterisk
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
              navigate(routes.exercises);
            }}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Container>
  );
};
