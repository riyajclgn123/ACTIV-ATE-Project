
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Group, Progress, Slider, Table, Title } from "@mantine/core";
import { createStyles } from "@mantine/emotion";



//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const MacroNutrient = () => {
  const { classes } = useStyles();


  return (
    <>
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
                                <Table.Td>90gm</Table.Td>
                                <Table.Td>25gm</Table.Td>
                                <Table.Td>65gm</Table.Td>
                                <Table.Td>2025/04/09</Table.Td>
                            </Table.Tr>
                            {/* <Slider
      color="blue"
      size="lg"
      radius="xl"
      labelAlwaysOn
      marks={[
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' },
      ]}
    /> */}   <Progress 
    value={25}
    color= "blue"
    size="xl"
    radius="xl"
    animated
    className={classes.progressBar} />
                    </Table.Tbody>
                </Table>
                </div>

    </>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },

    progressBar: {
        '& .mantine-Progress-bar': {
          transition: 'width 500ms ease',
        },
      },
  };
});
