import { Box, Card, Container, Space, Text } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import bgImage from "../../assets/bg.jpeg";
import { RingProgress } from "@mantine/core";
import { useEffect, useState } from "react";
import { ExerciseLogListing } from "../ExerciseLogs-page/exerciselog-listing";
import { FoodLogListing } from "../FoodLogs-page/food-logs-listing";
import { MacroNutrient } from "../MacroNutrient-pages/MacroNutrient";
import { useAuth } from "../../authentication/use-auth";
import { showNotification } from '@mantine/notifications';
import { ApiResponse, GoalGetDto } from "../../constants/types";
import api from "../../config/axios";
import { AxiosError } from "axios";

export const LandingPage = () => {
  const { classes } = useStyles();
  const { user } = useAuth();
  const [calorieGoal, setCalorieGoal] = useState<GoalGetDto | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const reset = () => setHovered(null);

  const fetchCalorieGoal = async () => {
    try {
      if (!user) {
        showNotification({ message: "User not authenticated", color: "red" });
        return;
      }
      const response = await api.get<ApiResponse<GoalGetDto>>(
        `/api/goals/user/${user.id}`
      );
      
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching calorie goal", color: "red" });
        return;
      }
  
      setCalorieGoal(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      showNotification({ 
        message: `Error fetching calorie goal: ${axiosError.message}`, 
        color: "red" 
      });
    }
  };
  
  useEffect(() => {
    fetchCalorieGoal();
  }, [user?.id]);

  return (
    <>
      <section id="backgrounddesign">
        <div className={classes.container1}>
          <div className={classes.overlayText}>
            <p className={classes.quote}>
              "Your Journey to a Healthier You Starts Here!"
            </p>
            <p>Welcome to your personalized fitness companion!</p>
            <p className={classes.threeword}>Track. Plan. Achieve.</p>
          </div>
        </div>
      </section>

      <section id="after-background-design" className={classes.afterBackground}>
        <Container>
          <Card withBorder shadow="sm" p="lg">
            <Text size="25px" style={{ fontWeight: "bold" }}>
              Calories Goal
            </Text>
            <div className={classes.coursel}>
              <RingProgress
                label={
                  <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                    {calorieGoal?.dailyCalorieGoal ? Math.round(Number(calorieGoal.dailyCalorieGoal)) : 'No goal set'} kcal
                </Text>
                }
                size={300}
                thickness={20}
                sections={[
                  {
                    value: 40,
                    color: "cyan",
                    tooltip: "Breakfast",
                    onMouseEnter: () => setHovered("Breakfast"),
                    onMouseLeave: reset,
                  },
                  {
                    value: 20,
                    color: "blue",
                    tooltip: "Snack",
                    onMouseEnter: () => setHovered("Snack"),
                    onMouseLeave: reset,
                  },
                  {
                    value: 15,
                    color: "indigo",
                    tooltip: "Lunch",
                    onMouseEnter: () => setHovered("Lunch"),
                    onMouseLeave: reset,
                  },
                  {
                    value: 12,
                    color: "red",
                    tooltip: "Dinner",
                    onMouseEnter: () => setHovered("Dinner"),
                    onMouseLeave: reset,
                  },
                ]}
              />

              <div className={classes.text}>
                <Space h="sm" />
                <Text
                  size="18px"
                  ta="center"
                  mt="lg"
                  style={{ fontWeight: "bold" }}
                >
                  Base Goal
                </Text>
                <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                {calorieGoal?.dailyCalorieGoal ? Math.round(Number(calorieGoal.dailyCalorieGoal)) : 'No goal set'} kcal
</Text>
                <Space h="sm" />
                <Text
                  size="18px"
                  ta="center"
                  mt="lg"
                  style={{ fontWeight: "bold" }}
                >
                  Food Count
                </Text>
                <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                  {/* {foodCount} */}
                </Text>
                <Space h="sm" />
                <Text
                  size="18px"
                  ta="center"
                  mt="lg"
                  style={{ fontWeight: "bold" }}
                >
                  Exercise Count
                </Text>
                <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                  {/* {exerciseCount} */}
                </Text>
                <Space h="sm" />
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <section>
        <Container className={classes.exerciselog}>
          <Card withBorder shadow="sm" p="lg">
            <ExerciseLogListing />
          </Card>
        </Container>

        <Container className={classes.foodlog}>
          <Card withBorder shadow="sm" p="lg">
            <FoodLogListing />
          </Card>
        </Container>

        <Container className={classes.macronutrient}>
          <Card withBorder shadow="sm" p="lg">
            <MacroNutrient />
          </Card>
        </Container>
      </section>
    </>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },

    container1: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "white",
      fontSize: "25px",
      height: "600px",
      width: "100%",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",

      "@media (max-width: 1024px)": {
        height: "500px",
      },

      "@media (max-width: 768px)": {
        height: "400px",
      },

      "@media (max-width: 480px)": {
        height: "300px",
      },
    },

    overlayText: {
      position: "absolute",
      color: "white",
      textAlign: "center",
      fontSize: "30px",
      fontWeight: "bold",
      maxWidth: "60%",
      zIndex: 1,
      wordWrap: "break-word",

      "@media (max-width: 768px)": {
        fontSize: "20px",
        maxWidth: "80%",
      },

      "@media (max-width: 480px)": {
        fontSize: "18px",
        maxWidth: "90%",
      },
    },

    quote: {
      fontSize: "35px",
      marginBottom: "10px",

      "@media (max-width: 768px)": {
        fontSize: "2rem",
      },

      "@media (max-width: 480px)": {
        fontSize: "1.5rem",
      },
    },

    threeword: {
      fontSize: "35px",
      fontWeight: "bold",
      marginTop: "20px",

      "@media (max-width: 768px)": {
        fontSize: "25px",
      },

      "@media (max-width: 480px)": {
        fontSize: "18px",
      },
    },

    button: {
      backgroundColor: "#4263eb",
      border: "none",
      color: "white",
      padding: "10px 20px",

      "@media (max-width: 768px)": {
        padding: "8px 15px",
      },

      "@media (max-width: 480px)": {
        padding: "6px 10px",
      },
    },

    container2: {
      margin: "50px 20px",
      fontSize: "2rem",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",

      "@media (max-width: 768px)": {
        fontSize: "1.5rem",
      },

      "@media (max-width: 480px)": {
        fontSize: "1.2rem",
      },
    },

    photocontainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",

      "@media (max-width: 1024px)": {
        gap: "15px",
        padding: "15px",
      },

      "@media (max-width: 768px)": {
        gap: "10px",
        padding: "10px",
      },

      "@media (max-width: 480px)": {
        flexDirection: "column",
        gap: "15px",
        padding: "10px",
      },
    },
    
    calorieGoal: {
      marginTop: "30px",
      marginBottom: "30px",
    },

    exerciselog: {
      marginTop: "30px",
      marginBottom: "30px",
    },

    foodlog: {
      marginTop: "30px",
      marginBottom: "30px",
    },

    macronutrient: {
      marginTop: "30px",
      marginBottom: "30px",
    },

    box: {},

    coursel: {
      gap: "100px",
      flexDirection: "row",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "@media (max-width: 768px)": {
        flexDirection: "column",
      },
    },

    authentication: {
      margin: "20px 0px 20px 0px",
      fontFamily: "Roboto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "@media (max-width: 768px)": {
        flexDirection: "column",
        gap: "10px",
      },
    },

    text: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },

    afterBackground: {
      marginTop: "50px",
    },
  };
});