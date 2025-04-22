import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Group,
  Progress,
  Slider,
  Table,
  Title,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useFoodContext } from "../../food/foodcontext";

export const MacroNutrient = () => {
  const { classes } = useStyles();
  const { dailyNutrients } = useFoodContext();
  console.log(dailyNutrients)

  const goals = {
    protein: 90,
    carbs: 200,
    fat: 60,
    fiber: 30,
    sugar: 25,
  };

  const getPercentage = (consumed: number, goal: number) => {
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <Title order={2} mb="md">My Macro Nutrient Logs</Title>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nutrients Name</Table.Th>
            <Table.Th>Goals</Table.Th>
            <Table.Th>Consumed</Table.Th>
            <Table.Th>Left</Table.Th>
            <Table.Th>Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Protein</Table.Td>
            <Table.Td>{goals.protein}gm</Table.Td>
            <Table.Td>{dailyNutrients.protein.toFixed(1)}gm</Table.Td>
            <Table.Td>{Math.max(goals.protein - dailyNutrients.protein, 0).toFixed(1)}gm</Table.Td>
            <Table.Td>{currentDate}</Table.Td>
          </Table.Tr>
          <Progress value={getPercentage(dailyNutrients.protein, goals.protein)} color="blue" size="xl" radius="xl" animated className={classes.progressBar} />

          <Table.Tr>
            <Table.Td>Carbs</Table.Td>
            <Table.Td>{goals.carbs}gm</Table.Td>
            <Table.Td>{dailyNutrients.carbs.toFixed(1)}gm</Table.Td>
            <Table.Td>{Math.max(goals.carbs - dailyNutrients.carbs, 0).toFixed(1)}gm</Table.Td>
            <Table.Td>{currentDate}</Table.Td>
          </Table.Tr>
          <Progress value={getPercentage(dailyNutrients.carbs, goals.carbs)} color="green" size="xl" radius="xl" animated className={classes.progressBar} />

          <Table.Tr>
            <Table.Td>Fat</Table.Td>
            <Table.Td>{goals.fat}gm</Table.Td>
            <Table.Td>{dailyNutrients.fat.toFixed(1)}gm</Table.Td>
            <Table.Td>{Math.max(goals.fat - dailyNutrients.fat, 0).toFixed(1)}gm</Table.Td>
            <Table.Td>{currentDate}</Table.Td>
          </Table.Tr>
          <Progress value={getPercentage(dailyNutrients.fat, goals.fat)} color="yellow" size="xl" radius="xl" animated className={classes.progressBar} />
        </Table.Tbody>
      </Table>
    </div>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },

    progressBar: {
      "& .mantine-Progress-bar": {
        transition: "width 500ms ease",
      },
    },
  };
});
