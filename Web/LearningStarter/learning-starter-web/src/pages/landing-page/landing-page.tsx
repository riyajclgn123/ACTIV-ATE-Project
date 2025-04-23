import {
  Box,
  Button,
  Card,
  Container,
  Select,
  Space,
  Tabs,
  Text,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import bgImage from "../../assets/bg.jpeg";
import { RingProgress } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { ExerciseLogListing } from "../ExerciseLogs-page/exerciselog-listing";
import { FoodLogListing } from "../FoodLogs-page/food-logs-listing";
import { MacroNutrient } from "../MacroNutrient-pages/MacroNutrient";
import { useAuth } from "../../authentication/use-auth";
import { showNotification } from "@mantine/notifications";
import { ApiResponse, FoodLogGetDto, GoalGetDto } from "../../constants/types";
import api from "../../config/axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDumbbell,
  faUtensils,
  faHandHoldingHeart,
  faList,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { DateNavigator } from "../../components/date-nav/date-nav";

export interface CalorieConsumedResponse {
  date: string;
  dailyCalorieGoal: number;
  totalCalories: number;
  calorieDifference: number;
  calorieStatus: string;
  foodLogs: FoodLogGetDto[];
}

export interface MealTimeTotals {
  breakfast: number;
  lunch: number;
  snack: number;
  dinner: number;
  total: number;
}

export const getDatestring = (unit: any) => {
  let localDate = new Date(unit ?? new Date());
  let formatted =
    localDate.getFullYear() +
    "-" +
    String(localDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(localDate.getDate()).padStart(2, "0");
  return formatted;
};

export const LandingPage = () => {
  const { classes } = useStyles();
  const { user } = useAuth();
  const [calorieGoal, setCalorieGoal] = useState<GoalGetDto | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reset = () => setHovered(null);
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState("list");

  const getStartOfDay = (date: Date | null) => {
    const d = date ? new Date(date) : new Date();
    return dayjs(d).startOf("day").format("MM/DD/YYYY"); // Sets to 00:00:00.000
  };

  // Get end of day (11:59 PM)
  const getEndOfDay = (date: Date | null) => {
    const d = date ? new Date(date) : new Date();
    return dayjs(d).endOf("day").format("MM/DD/YYYY"); // Sets to 23:59:59.999
  };

  // Calculate the date range
  const startDate = getStartOfDay(selectedDate);
  const endDate = getEndOfDay(selectedDate);

  useEffect(() => {
    async function fetchExerciseCount() {
      try {
        if (!user) return;

        const response = await api.get<ApiResponse<number>>(
          `/api/exercise-logs/count/user/${user.id}/range?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.data.hasErrors && response.data.data !== undefined) {
          setExerciseCount(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching exercise count:", error);
      }
    }

    fetchExerciseCount();
  }, [user?.id, startDate, endDate]);

  const [foodCount, setFoodCount] = useState<number>(0);

  useEffect(() => {
    async function fetchFoodCount() {
      try {
        if (!user) return;
        const response = await api.get<ApiResponse<number>>(
          `/api/food-logs/count/user/${user.id}/range?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.data.hasErrors && response.data.data !== undefined) {
          setFoodCount(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching exercise count:", error);
      }
    }

    fetchFoodCount();
  }, [user?.id, startDate, endDate]);

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
        showNotification({
          message: "Error fetching calorie goal",
          color: "red",
        });
        return;
      }

      setCalorieGoal(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      showNotification({
        message: `Error fetching calorie goal: ${axiosError.message}`,
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchCalorieGoal();
  }, [user?.id]);

  const [foodConsumed, setFoodConsumed] =
    useState<CalorieConsumedResponse | null>(null);
  const fetchCalorieConsumed = async () => {
    try {
      if (!user) {
        showNotification({ message: "User not authenticated", color: "red" });
        return;
      }
      const response = await api.get<ApiResponse<CalorieConsumedResponse>>(
        `/api/food-logs/user/${
          user.id
        }/calories-consumed-per-day?date=${getDatestring(selectedDate)}`
      );

      setFoodConsumed(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      showNotification({
        message: `Error fetching calorie goal: ${axiosError.message}`,
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchCalorieConsumed();
  }, [user?.id, selectedDate]);

  const [totals, setTotals] = useState<MealTimeTotals | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMealTimeTotals = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      const today = new Date().toISOString().split("T")[0];

      const response = await api.get<ApiResponse<MealTimeTotals>>(
        `/api/food-logs/user/${
          user.id
        }/user-meal-time-totals?date=${getDatestring(selectedDate)}`
      );

      if (response.data.hasErrors || !response.data.data) {
        throw new Error(
          response.data.errors?.join(", ") || "Failed to fetch data"
        );
      }

      setTotals(response.data.data);
    } catch (error) {
      showNotification({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch meal time data",
        color: "red",
      });
      setTotals({
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealTimeTotals();
  }, [user?.id, selectedDate]);

  const calculatePercentage = (value: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Use this instead of your current percentages calculation
  const getPercentages = () => {
    if (!totals) return { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };

    return {
      breakfast: calculatePercentage(totals.breakfast, totals.total),
      lunch: calculatePercentage(totals.lunch, totals.total),
      dinner: calculatePercentage(totals.dinner, totals.total),
      snack: calculatePercentage(totals.snack, totals.total),
    };
  };

  const percentages = useMemo(() => getPercentages(), [totals]);
 
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                size="25px"
                style={{ fontWeight: "bold", textAlign: "center" }}
              >
                Calories Goal
              </Text>
              <Button
                variant="outline"
                leftSection={<FontAwesomeIcon icon={viewMode === "tabs" ? faList: faTable} />}
                onClick={() =>
                  setViewMode(viewMode === "tabs" ? "list" : "tabs")
                }
              >
                {viewMode === "tabs" ? "List View" : "Tab View"}
              </Button>
            </div>
            <DateNavigator date={selectedDate} onChange={setSelectedDate} />
            <Space h={30}/>
            {viewMode === "tabs" ? (
              <Tabs defaultValue="Chart">
                <Tabs.List grow>
                  <Tabs.Tab
                    value="Chart"
                    leftSection={<FontAwesomeIcon icon={faChartLine} />}
                  >
                    Chart
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="Excercise Logs"
                    leftSection={<FontAwesomeIcon icon={faDumbbell} />}
                  >
                    Excercise Logs
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="Food Logs"
                    leftSection={<FontAwesomeIcon icon={faUtensils} />}
                  >
                    Food Logs
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="Macro Counts"
                    leftSection={<FontAwesomeIcon icon={faHandHoldingHeart} />}
                  >
                    Macro Counts
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="Chart">
                  <div className={classes.coursel}>
                    <RingProgress
                      label={
                        <div>
                          <Text
                            size="lg"
                            ta="center"
                            style={{ fontWeight: "bold" }}
                          >
                            {foodConsumed?.totalCalories || 0} /{" "}
                            {calorieGoal?.dailyCalorieGoal || 0} kcal
                          </Text>
                          <Text
                            size="sm"
                            ta="center"
                            style={{
                              color:
                                foodConsumed?.calorieDifference &&
                                foodConsumed.calorieDifference >= 0
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {foodConsumed?.calorieDifference || 0} kcal{" "}
                            {foodConsumed?.calorieDifference &&
                            foodConsumed.calorieDifference >= 0
                              ? "over"
                              : "under"}
                          </Text>
                        </div>
                      }
                      size={300}
                      thickness={20}
                      sections={[
                        {
                          value: percentages.breakfast,
                          color: "cyan",
                          tooltip: `Breakfast: ${
                            totals?.breakfast || 0
                          } kcal (${percentages.breakfast}%)`,
                          onMouseEnter: () => setHovered("Breakfast"),
                          onMouseLeave: reset,
                        },
                        {
                          value: percentages.lunch,
                          color: "indigo",
                          tooltip: `Lunch: ${totals?.lunch || 0} kcal (${
                            percentages.lunch
                          }%)`,
                          onMouseEnter: () => setHovered("Lunch"),
                          onMouseLeave: reset,
                        },
                        {
                          value: percentages.dinner,
                          color: "blue",
                          tooltip: `Dinner: ${totals?.dinner || 0} kcal (${
                            percentages.dinner
                          }%)`,
                          onMouseEnter: () => setHovered("Dinner"),
                          onMouseLeave: reset,
                        },
                        {
                          value: percentages.snack,
                          color: "red",
                          tooltip: `Snack: ${totals?.snack || 0} kcal (${
                            percentages.snack
                          }%)`,
                          onMouseEnter: () => setHovered("Snack"),
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
                      <Text
                        size="16px"
                        ta="center"
                        mt="md"
                        style={{ color: "gray" }}
                      >
                        {calorieGoal?.dailyCalorieGoal
                          ? Math.round(Number(calorieGoal.dailyCalorieGoal))
                          : "No goal set"}{" "}
                        kcal
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
                      <Text
                        size="16px"
                        ta="center"
                        mt="md"
                        style={{ color: "gray" }}
                      >
                        {foodCount}
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
                      <Text
                        size="16px"
                        ta="center"
                        mt="md"
                        style={{ color: "gray" }}
                      >
                        {exerciseCount}
                      </Text>
                      <Space h="sm" />
                    </div>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel value="Excercise Logs">
                  <Container className={classes.exerciselog}>
                    <Card withBorder shadow="sm" p="lg">
                      <ExerciseLogListing date={ false } dateProp={selectedDate}/>
                    </Card>
                  </Container>
                </Tabs.Panel>

                <Tabs.Panel value="Food Logs">
                  <Container className={classes.foodlog}>
                    <Card withBorder shadow="sm" p="lg">
                      <FoodLogListing date={ false } dateProp={selectedDate}/>
                    </Card>
                  </Container>
                </Tabs.Panel>

                <Tabs.Panel value="Macro Counts">
                  <Container className={classes.macronutrient}>
                    <Card withBorder shadow="sm" p="lg">
                      <MacroNutrient />
                    </Card>
                  </Container>
                </Tabs.Panel>
              </Tabs>
            ) : (
              <div>
                <Card withBorder shadow="sm" p="lg" mb="md">
                  <Text size="lg" style={{ fontWeight: "bold" }} mb="sm">
                    <FontAwesomeIcon icon={faChartLine} /> Chart
                  </Text>
                  <div className={classes.coursel}>
                    <RingProgress
                      label={
                        <div>
                          <Text
                            size="lg"
                            ta="center"
                            style={{ fontWeight: "bold" }}
                          >
                            {foodConsumed?.totalCalories || 0} /{" "}
                            {calorieGoal?.dailyCalorieGoal || 0} kcal
                          </Text>
                          <Text
                            size="sm"
                            ta="center"
                            style={{
                              color:
                                foodConsumed?.calorieDifference &&
                                foodConsumed.calorieDifference >= 0
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {foodConsumed?.calorieDifference || 0} kcal{" "}
                            {foodConsumed?.calorieDifference &&
                            foodConsumed.calorieDifference >= 0
                              ? "over"
                              : "under"}
                          </Text>
                        </div>
                      }
                      size={300}
                      thickness={20}
                      sections={[
                        {
                          value: percentages.breakfast,
                          color: "cyan",
                          tooltip: `Breakfast: ${
                            totals?.breakfast || 0
                          } kcal (${percentages.breakfast}%)`,
                          onMouseEnter: () => setHovered("Breakfast"),
                          onMouseLeave: reset,
                        },
                        {
                          value: percentages.lunch,
                          color: "indigo",
                          tooltip: `Lunch: ${totals?.lunch || 0} kcal (${
                            percentages.lunch
                          }%)`,
                          onMouseEnter: () => setHovered("Lunch"),
                          onMouseLeave: reset,
                        },
                        {
                          value: percentages.dinner,
                          color: "blue",
                          tooltip: `Dinner: ${totals?.dinner || 0} kcal (${
                            percentages.dinner
                          }%)`,
                          onMouseEnter: () => setHovered("Dinner"),
                          onMouseLeave: reset,
                        },
                        {
                          value: percentages.snack,
                          color: "red",
                          tooltip: `Snack: ${totals?.snack || 0} kcal (${
                            percentages.snack
                          }%)`,
                          onMouseEnter: () => setHovered("Snack"),
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
                      <Text
                        size="16px"
                        ta="center"
                        mt="md"
                        style={{ color: "gray" }}
                      >
                        {calorieGoal?.dailyCalorieGoal
                          ? Math.round(Number(calorieGoal.dailyCalorieGoal))
                          : "No goal set"}{" "}
                        kcal
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
                      <Text
                        size="16px"
                        ta="center"
                        mt="md"
                        style={{ color: "gray" }}
                      >
                        {foodCount}
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
                      <Text
                        size="16px"
                        ta="center"
                        mt="md"
                        style={{ color: "gray" }}
                      >
                        {exerciseCount}
                      </Text>
                      <Space h="sm" />
                    </div>
                  </div>
                  {/* Chart content here */}
                </Card>

                <Card withBorder shadow="sm" p="lg" mb="md">
                  <Text size="lg" style={{ fontWeight: "bold" }} mb="sm">
                    <FontAwesomeIcon icon={faDumbbell} /> Exercise Logs
                  </Text>
                  <ExerciseLogListing date = {false} dateProp = {selectedDate} />
                </Card>

                <Card withBorder shadow="sm" p="lg" mb="md">
                  <Text size="lg" style={{ fontWeight: "bold" }} mb="sm">
                    <FontAwesomeIcon icon={faUtensils} /> Food Logs
                  </Text>
                  <FoodLogListing date = {false} dateProp = {selectedDate}/>
                </Card>

                <Card withBorder shadow="sm" p="lg">
                  <Text size="lg" style={{ fontWeight: "bold" }} mb="sm">
                    <FontAwesomeIcon icon={faHandHoldingHeart} /> Macro Counts
                  </Text>
                  <MacroNutrient />
                </Card>
              </div>
            )}
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
      backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(14, 14, 14, 0.5)
    ),url(${bgImage})`,
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
      alignSelf: "center",
      textAlign: "center",
      fontSize: "30px",
      fontWeight: "bold",
      zIndex: 1,
      wordWrap: "break-word",
      whiteSpace: "nowrap",
      textShadow: "2px 2px 4px rgb(31, 101, 239)",
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
