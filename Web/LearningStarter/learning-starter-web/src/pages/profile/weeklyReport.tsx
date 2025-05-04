import { useState, useEffect } from "react";
import { Text, Loader, Container, Title, Space, Button } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useAuth } from "../../authentication/use-auth";
import "@mantine/charts/styles.css";
import { getDatestring } from "../landing-page/landing-page";

interface ExerciseChartData {
  date: string;
  Exercise: number;
}

interface ExerciseLog {
  userId: number;
  date: string;
  caloriesBurned: number;
}

interface MealChartData {
  date: string;
  Breakfast: number;
  Lunch: number;
  Snack: number;
  Dinner: number;
}

interface DailyReport {
  userId: number;
  date: string;
  mealTime: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  totalCalories: number;
}

export const WeeklyReport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [daysOffset, setDaysOffset] = useState(0);
  const [mealData, setMealData] = useState<MealChartData[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseChartData[]>([]);

  const getDateRange = (offset: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - offset * 7);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    return { startDate, endDate };
  };

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange(daysOffset);

      Promise.allSettled([
        fetch(
          `/api/dailyReports/user/${user.id}/range?startDate=${getDatestring(
            startDate
          )}&endDate=${getDatestring(endDate)}`
        ),
        fetch(
          `/api/exercise-logs/user/${user.id}/range?startDate=${getDatestring(
            startDate
          )}&endDate=${getDatestring(endDate)}`
        ),
      ]).then((results) => {
        const [mealsResult, exerciseResult] = results;

        if (mealsResult.status === "fulfilled") {
          mealsResult.value
            .json()
            .then((mealsData: { data?: DailyReport[] }) => {
              setMealData(
                transformMealData(mealsData.data || [], startDate, endDate)
              );
            })
            .catch((error: Error) => {
              console.error("Meals data parsing failed:", error);
            });
        } else {
          console.error("Meals request failed:", mealsResult.reason);
        }

        if (exerciseResult.status === "fulfilled") {
          exerciseResult.value
            .json()
            .then((exerciseData: { data?: ExerciseLog[] }) => {
              setExerciseData(
                transformExerciseData(
                  exerciseData.data || [],
                  startDate,
                  endDate
                )
              );
            })
            .catch((error: Error) => {
              console.error("Exercise data parsing failed:", error);
            });
        } else {
          console.error("Exercise request failed:", exerciseResult.reason);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformMealData = (
    apiData: DailyReport[],
    startDate: Date,
    endDate: Date
  ): MealChartData[] => {
    const result: MealChartData[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dayData: MealChartData = {
        date: dateStr,
        Breakfast: 0,
        Lunch: 0,
        Snack: 0,
        Dinner: 0,
      };

      apiData
        .filter(
          (item) =>
            new Date(item.date).toDateString() === currentDate.toDateString()
        )
        .forEach((item) => {
          dayData[item.mealTime] = item.totalCalories;
        });

      result.push(dayData);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  const transformExerciseData = (
    apiData: ExerciseLog[],
    startDate: Date,
    endDate: Date
  ): ExerciseChartData[] => {
    const result: ExerciseChartData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dailyExercise = apiData
        .filter(
          (item) =>
            new Date(item.date).toDateString() === currentDate.toDateString()
        )
        .reduce((sum, item: any) => sum + item.totalCaloriesBurned, 0);

      result.push({
        date: dateStr,
        Exercise: dailyExercise,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  useEffect(() => {
    fetchData();
  }, [user, daysOffset]);

  if (loading) return <Loader />;

  return (
    <Container>
      <Space h="md" />
      <Title
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Weekly Report
      </Title>
      <Space h="md" />

      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => setDaysOffset(daysOffset + 1)}
          disabled={daysOffset >= 4}
          variant="outline"
          color="#FFD700"
        >
          Previous Week
        </Button>
        <Button
          onClick={() => setDaysOffset(Math.max(0, daysOffset - 1))}
          disabled={daysOffset === 0}
          variant="outline"
          color="#FFD700"
        >
          Next Week
        </Button>
      </div>

      {mealData.length > 0 && (
        <>
          <Text size="lg" fw={500}>
            Calories Consumed
          </Text>
          <Space h="md" />
          <LineChart
            h={300}
            data={mealData}
            dataKey="date"
            unit=" calories"
            withLegend
            legendProps={{ verticalAlign: "bottom", height: 50 }}
            curveType="monotone"
            series={[
              { name: "Breakfast", color: "pink" },
              { name: "Lunch", color: "blue.6" },
              { name: "Snack", color: "teal.6" },
              { name: "Dinner", color: "red" },
            ]}
          />
        </>
      )}

      {exerciseData.length > 0 && (
        <>
          <Text size="lg" fw={500} mt="xl">
            Calories Burned
          </Text>
          <Space h="md" />
          <LineChart
            h={300}
            data={exerciseData}
            dataKey="date"
            unit=" calories"
            withLegend
            legendProps={{ verticalAlign: "bottom" }}
            curveType="monotone"
            series={[{ name: "Exercise", color: "green" }]}
          />
        </>
      )}

      {mealData.length === 0 && exerciseData.length === 0 && (
        <Text>No data available for this week</Text>
      )}
    </Container>
  );
};
