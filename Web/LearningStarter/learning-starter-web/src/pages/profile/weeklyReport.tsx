import { useState, useEffect } from "react";
import { Text, Loader, Container, Title, Space, Button } from "@mantine/core";
import { LineChart } from '@mantine/charts';
import { useAuth } from "../../authentication/use-auth";

// Define the exact shape of our chart data
interface ChartData {
  date: string;
  Breakfast: number;
  Lunch: number;
  Snack: number;
  Dinner: number;
}

// Type for the API response items
interface DailyReport {
  userId: number;
  date: string;
  mealTime: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  totalCalories: number;
}

export const WeeklyReport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [daysOffset, setDaysOffset] = useState(0);

  const getDateRange = (offset: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (offset * 7));
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    return { startDate, endDate };
  };

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange(daysOffset);
      
      const response = await fetch(
        `/api/dailyReports/user/${user.id}/range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const { data } = await response.json() as { data: DailyReport[] };
      
      const transformedData = transformData(data || [], startDate, endDate);
      setChartData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformData = (apiData: DailyReport[], startDate: Date, endDate: Date): ChartData[] => {
    const result: ChartData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Initialize with all meal types set to 0
      const dayData: ChartData = {
        date: dateStr,
        Breakfast: 0,
        Lunch: 0,
        Snack: 0,
        Dinner: 0
      };
      
      // Filter and process data for this specific date
      apiData
        .filter(item => new Date(item.date).toDateString() === currentDate.toDateString())
        .forEach(item => {
          // TypeScript now knows item.mealTime can only be one of these values
          dayData[item.mealTime] = item.totalCalories;
        });
      
      result.push(dayData);
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
      <Title>Weekly Report</Title>
      <Space h="md" />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button 
          onClick={() => setDaysOffset(daysOffset + 1)}
          disabled={daysOffset >= 4}
        >
          Previous Week
        </Button>
        <Button 
          onClick={() => setDaysOffset(Math.max(0, daysOffset - 1))}
          disabled={daysOffset === 0}
        >
          Next Week
        </Button>
      </div>

      {chartData.length > 0 ? (
        <>
          <Text size="lg" fw={500}>Calories Consumed</Text>
          <Space h="md" />
          <LineChart
            h={300}
            data={chartData}
            dataKey="date"
            unit=" calories"
            series={[
              { name: 'Breakfast', color: 'pink' },
              { name: 'Lunch', color: 'blue.6' },
              { name: 'Snack', color: 'teal.6' },
              { name: 'Dinner', color: 'red' },
            ]}
          />
        </>
      ) : (
        <Text>No data available for this week</Text>
      )}
    </Container>
  );
};