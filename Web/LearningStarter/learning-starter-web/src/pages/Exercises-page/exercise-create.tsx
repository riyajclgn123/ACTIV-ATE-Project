import { FormErrors } from "@mantine/form/lib/types";
import {
  ApiResponse,
  ExerciseCreateDto,
  ExerciseGetDto,
} from "../../constants/types";
import { useForm } from "@mantine/form";
import { Box, Button, Card, Container, Flex, Space, TextInput, useMantineColorScheme } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { createStyles } from "@mantine/emotion";

export const ExerciseCreate = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
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
    <Container style={{marginTop: "20px"}}>
      <Box maw={600} mx="auto" p="md" pos="relative">
        <Card withBorder shadow="sm" p="lg" className={classes.card1}>
      <form onSubmit={mantineForm.onSubmit(submitExercise)} color="white">
        <TextInput
          {...mantineForm.getInputProps("name")}
          label="Name"
          placeholder="Enter exercise name"
          withAsterisk
        />
         <Space h={18} />
        <TextInput
          {...mantineForm.getInputProps("description")}
          label="Descriptions"
          placeholder="Enter exercise description"
          withAsterisk
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
              navigate(routes.exercises);
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
