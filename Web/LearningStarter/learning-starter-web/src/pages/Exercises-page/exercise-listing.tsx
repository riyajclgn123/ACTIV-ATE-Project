import { useEffect, useState } from "react";
import { ApiResponse, ExerciseGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import {
  Button,
  Card,
  SimpleGrid,
  Space,
  TextInput,
  Text,
  useMantineColorScheme,
  Container,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import {
  faArrowLeft,
  faHistory,
  faPencil,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../authentication/use-auth";
import dumbell from "../../assets/dumbbell.jpg";
import squart from "../../assets/squart.jpg";
import legpress from "../../assets/legpress.jpg";
import flat from "../../assets/flat.jpg";
import cardio from "../../assets/cardio.jpg";
import cycling from "../../assets/cycling.jpg";
import chestpress from "../../assets/chestpress.jpg";
import inclined from "../../assets/inclined.jpg";
import cable from "../../assets/cable1.jpg";
export const ExerciseListing = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [exercises, setExercises] = useState<ExerciseGetDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<ExerciseGetDto[]>(
    []
  );
  const { user } = useAuth();

  useEffect(() => {
    fetchExercises();
    async function fetchExercises() {
      const response = await api.get<ApiResponse<ExerciseGetDto[]>>(
        "/api/exercises"
      );
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching exercises" });
      }
      if (response.data.data) {
        setExercises(response.data.data);
      }
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExercises([]);
    } else {
      const filtered = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const handleExerciseClick = (exercise: ExerciseGetDto) => {
    if (!user?.id) {
      showNotification({
        title: "Error",
        message: "You must be logged in to log exercises",
        color: "red",
      });
      return;
    }

    navigate(routes.exerciseLogCreate.replace(":id", exercise.id.toString()), {
      state: {
        exercise: {
          id: exercise.id,
          name: exercise.name,
        },
        userId: user.id,
      },
    });
  };

  const handleEditClick = (exerciseId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    navigate(`/exercises/update/${exerciseId}`);
  };

  const exerciseImages: Record<string, string> = {
    Dumbbell: dumbell,
    Squat: squart,
    "Leg Press": legpress,
    "Flat Bench Press": flat,
    Cardio: cardio,
    Cycling: cycling,
    "Chest Press": chestpress,
    "Inclined Bench Press": inclined,
    //"cable machine": cable,
    // Add more mappings as needed
  };

  return (
    <>
      <Container
        className={classes.container}
        fluid
        p={0}
        style={{ maxWidth: "100vw" }}
      >
        <Container className={classes.headerSection}>
          <Container className={classes.buttonsContainer}>
            <Button
              onClick={() => navigate(routes.exerciseLog)}
              leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
              variant="outline"
              color="red"
            >
              Back To Exercise Log
            </Button>
            <Button
              onClick={() => {
                navigate(routes.exerciseCreate);
              }}
              variant="outline"
              color="#008b84"
              leftSection={<FontAwesomeIcon icon={faPlus} />}
            >
              Create New Exercise
            </Button>
          </Container>

          <Container className={classes.searchContainer}>
            <TextInput
              placeholder="Search for an exercise.."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              className={classes.searchbox}
              leftSection={<FontAwesomeIcon icon={faSearch} />}
              radius="md"
            />

            {searchQuery.trim() !== "" && (
              <div className={classes.dropdown}>
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={classes.dropdownItemContainer}
                  >
                    <div
                      className={classes.dropdownItem}
                      onClick={() => handleExerciseClick(exercise)}
                    >
                      {exercise.name}
                    </div>
                    <FontAwesomeIcon
                      className={classes.iconButton}
                      icon={faPencil}
                      onClick={(e) => handleEditClick(exercise.id, e)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Container>

        <div className={classes.gridContainer}>
          <Text
            size="xl"
            fw={700}
            ta="center"
            mb="xl"
            className={classes.sectionTitle}
          >
            Quick Log Exercises
          </Text>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="xl"
            verticalSpacing="xl"
          >
            {exercises.map((exercise) => (
              <Card
                key={exercise.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={classes.exerciseCard}
                onClick={() => handleExerciseClick(exercise)}
              >
                <Card.Section className={classes.cardImageSection}>
                  <img
                    src={exerciseImages[exercise.name] || dumbell}
                    height={200}
                    width="100%"
                    alt={exercise.name}
                    className={classes.cardImage}
                  />
                </Card.Section>
                <Text
                  fw={600}
                  size="md"
                  mt="sm"
                  ta="center"
                  className={classes.exerciseName}
                >
                  {exercise.name}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </div>
      </Container>
    </>
  );
};

const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  return {
    gridContainer: {
      padding: theme.spacing.xl,
      maxWidth: "1400px",
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: "2rem",
      color: isDark ? theme.colors.gray[1] : theme.colors.dark[7],
      marginBottom: "2rem",
      position: "relative",
      "&::after": {
        content: '""',
        display: "block",
        width: "100px",
        height: "4px",
        backgroundColor: "#0fa462",
        margin: "0.5rem auto 0",
        borderRadius: "2px",
      },
    },

    exerciseCard: {
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      aspectRatio: "1/1",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows.lg,
      },
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

    cardImageSection: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderBottom: `1px solid ${theme.colors.gray[2]}`,
    },

    cardImage: {
      objectFit: "cover",
      width: "100%",
      height: "100%",
      transition: "transform 0.3s",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },

    exerciseName: {
      color: isDark ? theme.colors.gray[1] : theme.colors.gray[7],
      padding: theme.spacing.sm,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "18px",
    },

    iconButton: {
      cursor: "pointer",
      padding: "5px",
      fontSize: "14px",
      color: isDark ? theme.colors.blue[4] : theme.colors.blue[6],
      "&:hover": {
        color: "orange",
      },
    },

    container: {
      display: "flex",
      flexDirection: "column",
      color: colorScheme === "dark" ? "white" : "black",
      fontSize: "20px",
      margin: "0px",
      minHeight: "100vh",
      width: "100%",
    },

    headerSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "20px 20px 0 20px",
    },

    searchContainer: {
      position: "relative",
      width: "100%",
      maxWidth: "800px",
    },

    searchbox: {
      width: "100%",
      fontSize: "18px",
      "& input": {
        height: "45px",
      },
    },

    buttonsContainer: {
      padding: "0px",
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "20px",
      width: "100%",
      maxWidth: "560px",
    },

    dropdown: {
      position: "absolute",
      top: "100%",
      width: "80%",
      background: isDark ? theme.colors.dark[5] : theme.white,
      borderRadius: theme.radius.sm,
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      zIndex: 10,
      overflow: "hidden",
      border: `1px solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
    dropdownItem: {
      cursor: "pointer",
      color: isDark ? theme.white : theme.black,
      fontSize: "16px",
      flexGrow: 1,
    },
    createNewExercise: {
      padding: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "blue",
      fontSize: "20px",
    },
    dropdownItemContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 15px",
      borderBottom: `1px solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
      "&:last-child": {
        borderBottom: "none",
      },
      "&:hover": {
        backgroundColor: isDark ? theme.colors.dark[4] : theme.colors.gray[0],
      },
    },
  };
});
