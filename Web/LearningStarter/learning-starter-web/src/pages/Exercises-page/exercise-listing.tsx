import { useEffect, useState } from "react";
import { ApiResponse, ExerciseGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { Button, Card, SimpleGrid, Space, TextInput, Text, useMantineColorScheme } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { faHistory, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import exercisebgImage from "../../assets/exercisebg.jpg";
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
    "Dumbbell": dumbell,
    "Squat": squart,
    "Leg Press": legpress,
    "Flat Bench Press": flat,
    "Cardio": cardio,
    "Cycling": cycling,
    "Chest Press": chestpress,
    "Inclined Bench Press": inclined,
    //"cable machine": cable,
    // Add more mappings as needed
  };

  return (
    <>
      <section>

      <div className={classes.gridContainer}>
          <Text size="xl" fw={700} ta="center" mb="xl" className={classes.sectionTitle}>
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
                <Text fw={600} size="md" mt="sm" ta="center" className={classes.exerciseName}>
                  {exercise.name}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        <div className={classes.container}>
          <div className={classes.overlayText}>
            <h2>Insert your Exercise</h2>
            <TextInput
              placeholder="Search for an exercise.."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              className={classes.searchbox}
            />

            {searchQuery.trim() !== "" && (
              <div className={classes.dropdown}>
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
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
                  ))
                ) : (
                  <div
                    className={classes.createNewExercise}
                    onClick={() => {
                      navigate(routes.exerciseCreate, {
                        state: { exerciseName: searchQuery },
                      });
                      setSearchQuery("");
                      setFilteredExercises([]);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <Space w={8} />
                    Create "{searchQuery}"
                  </div>
                )}
              </div>
            )}

            <div className={classes.buttonBackground}>
            <Button
                onClick={() => navigate(routes.exerciseLog)}
                leftSection={<FontAwesomeIcon icon={faHistory} />}
                variant="outline"
              color="red"
              >
                Back To Log
              </Button>
              <Button
                onClick={() => {
                  navigate(routes.exerciseCreate);
                }}
                variant="outline"
              color="blue"
              >
                <FontAwesomeIcon icon={faPlus} />
                <Space w={8} />
                Create Exercise
              </Button>
              
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

const useStyles = createStyles((theme) => {
   const { colorScheme } = useMantineColorScheme();
   const isDark = colorScheme === 'dark';
  return {
    gridContainer: {
      padding: theme.spacing.xl,
      maxWidth: '1400px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: '2rem',
      color: isDark ? theme.colors.gray[1] : theme.colors.dark[7],
      marginBottom: '2rem',
      position: 'relative',
      '&::after': {
        content: '""',
        display: 'block',
        width: '100px',
        height: '4px',
        backgroundColor: "#0fa462",
        margin: '0.5rem auto 0',
        borderRadius: '2px',
      },
    },
  
    exerciseCard: {
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      aspectRatio: '1/1', // Makes the card square
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows.lg,
      },
    },
  
    cardImageSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderBottom: `1px solid ${theme.colors.gray[2]}`,
    },
  
    cardImage: {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
  
    exerciseName: {
      color: isDark ? theme.colors.gray[1] : theme.colors.gray[7],
      padding: theme.spacing.sm,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: "18px"
    },

    iconButton: {
      cursor: "pointer",
      color: "black",
      "&:hover": {
        color: "orange",
      },
    },
    exerciseListingContainer: {
      padding: "20px",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "white",
      fontSize: "20px",
      margin: "0px",
      minHeight: "100vh", // Make sure the container takes full height of the screen
      width: "100%", // Full width of the container

      backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ),url(${exercisebgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "10px",
    },

    overlayText: {
      position: "absolute",
      color: "white",
      alignSelf: "center",
      textAlign: "center",
      fontSize: "30px",
      fontWeight: "bold",
      zIndex: 1,
      wordWrap: "break-word",
      whiteSpace: "nowrap",
      // textShadow: "2px 2px 4px #fa5252",

      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "80%",
      [`@media (max-width: 768px)`]: {
        fontSize: "24px",
      },
    },
    searchbox: {
      color: "black",
      fontSize: "20px",
      position: "relative",
      width: "100%",
      maxWidth: "340px",
      padding: "5px",
    },

    buttonBackground: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      marginTop: "20px",
      width: "100%",
    },

    calorieburnestimator: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "black",
      fontSize: "40px",
      marginTop: "30px",
      [`@media (max-width: 768px)`]: {
        fontSize: "30px",
      },

      [`@media (max-width: 480px)`]: {
        fontSize: "24px",
      },
    },

    donutchart: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "50px",
      fontFamily: "Roboto",
      fontWeight: "bold",
      gap: "10px",
      margin: "30px 0px",

      [`@media (maxWidth: 1024px)`]: {
        fontSize: "40px",
      },

      [`@media (maxWidth: 768px)`]: {
        fontSize: "35px",
      },

      [`@media (maxWidth: 480px)`]: {
        fontSize: "28px",
      },
    },

    dropdown: {
      position: "absolute",
      top: "100%",
      width: "80%",
      background: "white",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: 10,
      marginTop: "5px",
    },
    dropdownItem: {
      padding: "5px",
      cursor: "pointer",
      borderBottom: "1px solid #eee",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
      color: "black",
      fontSize: "20px",
    },
    createNewExercise: {
      padding: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "blue",
      "&:hover": {
        backgroundColor: "#e8f0ff",
      },
      fontSize: "20px",
    },
    dropdownItemContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      borderBottom: "1px solid #eee",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },
  };
});
