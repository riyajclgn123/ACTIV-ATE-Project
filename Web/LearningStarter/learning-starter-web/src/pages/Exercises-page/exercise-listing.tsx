import { useEffect, useState } from "react";
import { ApiResponse, ExerciseGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import {
  Button,
  Container,
  Flex,
  Group,
  Space,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { faHistory, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import exercisebgImage from "../../assets/exercisebg.jpg";
import { useAuth } from "../../authentication/use-auth";

//import { Header } from "@mantine/core";

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
        userId: user.id, // Pass the authenticated user's ID
      },
    });
  };

  const handleEditClick = (exerciseId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    navigate(`/exercises/update/${exerciseId}`);
  };

  return (
    <>
      <section>
        <div className={classes.container}>
          <div className={classes.overlayText}>
            <h2>Insert your Exercise</h2>
            <TextInput
              //label="Search"
              placeholder="Search for an exercise.."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              className={classes.searchbox}
            />
            {/* Do Search Bar */}

            {/* Search Dropdown */}
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
                  // "Create New Exercise" option if no match found
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
                onClick={() => {
                  navigate(routes.exerciseCreate);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                <Space w={8} />
                New Exercise
              </Button>
              <Button
                onClick={() => navigate(routes.exerciseLog)}
                leftSection={<FontAwesomeIcon icon={faHistory} />}
              >
                View My Logs
              </Button>
            </div>
          </div>
        </div>
        <div>
          {exercises && (
            <div>
              <div className={classes.calorieburnestimator}> </div>
            </div>
          )}
        </div>
      </section>
      <section>
        <Group gap={50} className={classes.donutchart}>
          <div>
            <div>Calories Burned</div>
          </div>
        </Group>
      </section>
    </>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
      color: "black",
      "&:hover": {
        color: "blue",
      },
    },
    exerciseListingContainer: {
      padding: "20px",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative", // Ensure text is positioned over the background image
      color: "white",
      fontSize: "20px",
      margin: "0px",
      height: "600px", // Make sure the container takes full height of the screen
      width: "100%", // Full width of the container
      backgroundImage: `url(${exercisebgImage})`, // Set the background image
      backgroundSize: "cover", // Ensure the image covers the full container
      backgroundPosition: "center", // Center the image in the container
      backgroundRepeat: "no-repeat", // Prevent repeating the background image
      padding: "10px",
      [`@media (max-width: 1024px)`]: {
        maxWidth: "500px", // Reduce width for medium screens
      },

      [`@media (max-width: 768px)`]: {
        maxWidth: "450px", // Further reduce for tablets
      },

      [`@media (max-width: 480px)`]: {
        height: "400px",
        padding: "5px",
      },
    },

    overlayText: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Aligns content at the top
      alignItems: "center",
      position: "absolute", // To position the text above the background
      color: "white", // White text color for better contrast
      textAlign: "center", // Center the text horizontally
      fontSize: "30px", // Default font size for text
      fontWeight: "bold", // Bold the text
      maxWidth: "80%", // Limit the text width for better readability
      zIndex: 1, // Make sure text is above the background image
      [`@media (max-width: 768px)`]: {
        fontSize: "24px",
      },
    },
    searchbox: {
      color: "black",
      fontSize: "20px",
      position: "relative",
      width: "100%",
      maxWidth: "340px", // Keeps it from stretching too much
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
