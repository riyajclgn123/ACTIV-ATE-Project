import { useState, useEffect } from "react";
import { Text, Button, TextInput, Loader, Table, Notification, Container, Title, Space } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAuth } from "../../authentication/use-auth"; 
import { createStyles } from "@mantine/emotion";
import { AreaChart, LineChart } from '@mantine/charts';


export const data = [
  {
    date: 'Mar 22',
    Breakfast: 299,
    Lunch: 600,
    Snack: 500,
    Dinner: 700,
  },
  {
    date: 'Mar 23',
    Breakfast: 315,
    Lunch: 638,
    Snack: 452,
    Dinner: 980,
  },
  {
    date: 'Mar 24',
    Breakfast: 390,
    Lunch: 438,
    Snack: 572,
    Dinner: 920,
  },
  {
    date: 'Mar 25',
    Breakfast: 490,
    Lunch: 518,
    Snack: 755,
    Dinner: 600,
  },
  {
    date: 'Mar 26',
    Breakfast: 290,
    Lunch: 233,
    Snack: 752,
    Dinner: 500,
  },
  {
    date: 'Mar 26',
    Breakfast: 290,
    Lunch: 333,
    Snack: 552,
    Dinner: 500,
  },
  {
    date: 'Mar 26',
    Breakfast: 290,
    Lunch: 233,
    Snack: 852,
    Dinner: 500,
  },
];

export const data1 = [
  {
    date: 'Mar 22',
    Exercise: 299,
  },
  {
    date: 'Mar 23',
    Exercise: 315,
  },
  {
    date: 'Mar 24',
    Exercise: 390,
  },
  {
    date: 'Mar 25',
    Exercise: 490,
  },
  {
    date: 'Mar 26',
    Exercise: 290,
  },
  {
    date: 'Mar 27',
    Exercise: 390,
  },
  {
    date: 'Mar 28',
    Exercise: 590,
  },
];

export const WeeklyReport = () => {
  
  return (
    <Container>
        <Title>
            Weekly Report
        </Title>
        <Space h={35}/>

        <Text>
            This is the weekly report page. You can view your weekly progress here.
        </Text>
        <Space h={25} />

        <Text size="lg" style={{fontWeight:"bold"}}> Calorie Consumed</Text>
        <Space h={25} />

        <LineChart
      h={300}
      data={data}
      dataKey="date"
      unit=" calories"
      series={[
        { name: 'Breakfast', color: 'pink' },
        { name: 'Lunch', color: 'blue.6' },
        { name: 'Snack', color: 'teal.6' },
        { name: 'Dinner', color: 'red' },
      ]}
      
    />

<Space h={25} />


<Text size="lg" style={{fontWeight:"bold"}}> Calorie Burned</Text>
        <Space h={25} />

        <LineChart
      h={300}
      data={data1}
      dataKey="date"
      unit=" calories"
      series={[
        { name: 'Exercise', color: 'pink' },

      ]}
      
    />
    </Container>
  );
}; 

const useStyles = createStyles(() => {
  return {
    table: {
      margin: "20px",
    }
  }
});