import { useEffect, useState } from "react";
import { ApiResponse, FoodGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { useAuth } from "../../authentication/use-auth";
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Space,
  Table,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import {
  faArrowLeft,
  faHistory,
  faPencil,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import pizza from "../../assets/pizza.jpg";
import burger from "../../assets/burger.jpg";
import friedChickenLeg from "../../assets/fried-chicken-leg.jpg";
import frenchFries from "../../assets/french-fries.jpg";
import tboneSteak from "../../assets/tbone-steak.jpg";
import mashedPotatoes from "../../assets/mashed-potatoes.jpg";
import eggSandwich from "../../assets/egg-sandwich.jpg";
import proteinShake from "../../assets/protein-shake.jpg";


export const FoodListing = () => {
  const location = useLocation();
  const mealTimeFromState = location.state?.mealTime || "Breakfast";
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [foods, setFoods] = useState<FoodGetDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<FoodGetDto[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchFoods();
    async function fetchFoods() {
      const response = await api.get<ApiResponse<FoodGetDto[]>>("/api/foods");
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching foods" });
      }
      if (response.data.data) {
        setFoods(response.data.data);
      }
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFoods([]);
    } else {
      const filtered = foods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    }
  }, [searchQuery, foods]);

  const handleFoodClick = (food: FoodGetDto) => {
    if (!user?.id) {
      showNotification({
        title: "Error",
        message: "You must be logged in to log food",
        color: "red",
      });
      return;
    }
    navigate(routes.foodLogCreate.replace(":id", food.id.toString()), {
      state: {
        food: {
          id: food.id,
          name: food.name,
        },
        userId: user.id,
        mealTime: mealTimeFromState,
      },
    });
  };

  const handleEditClick = (foodId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    navigate(`/foods/update/${foodId}`);
  };

  const foodImages: Record<string, string> = {
    'Pizza': pizza,
    'Burger': burger,
    'Fried chicken leg': friedChickenLeg,
    'Mashed potatoes': mashedPotatoes,
    'Egg sandwich': eggSandwich,
    'T-bone steak': tboneSteak,
    'French fries': frenchFries,
    'Protein shake': proteinShake,
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
              onClick={() => navigate(routes.foodLog)}
              leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
              color="red"
              variant="outline"
            >
              Back To Food Log
            </Button>
            <Button
              onClick={() => navigate(routes.foodCreate)}
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              variant="outline"
              color="#008b84"
            >
              Create New Food
            </Button>
          </Container>
          <Container className={classes.searchContainer}>
            <TextInput
              placeholder="Search for a food..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              className={classes.searchbox}
              leftSection={<FontAwesomeIcon icon={faSearch} />}
              radius="md"
            />

            {filteredFoods.length > 0 && (
              <div className={classes.dropdown}>
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className={classes.dropdownItemContainer}
                    onClick={() => handleFoodClick(food)}
                  >
                    <div className={classes.dropdownItem}>{food.name}</div>
                    <FontAwesomeIcon
                      className={classes.editFoodItemButton}
                      icon={faPencil}
                      onClick={(event) => handleEditClick(food.id, event)}
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
            Quick Log Foods
          </Text>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="20px"
            verticalSpacing="20px"
          >
            {foods.map((food) => (
              <Card
                key={food.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={classes.foodCard}
                onClick={() => handleFoodClick(food)}
              >
                <Card.Section className={classes.cardImageSection}>
                  <img
                    src={foodImages[food.name] || pizza}
                    height={200}
                    width="100%"
                    alt={food.name}
                    className={classes.cardImage}
                  />
                </Card.Section>
                <Text
                  fw={600}
                  size="md"
                  mt="sm"
                  ta="center"
                  className={classes.foodName}
                >
                  {food.name}
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
      padding: "20px",
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

    foodCard: {
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

    foodName: {
      color: isDark ? theme.colors.gray[1] : theme.colors.gray[7],
      padding: theme.spacing.sm,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "18px",
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

    dropdown: {
      position: "absolute",
      top: "calc(100% + 5px)",
      width: "100%",
      background: isDark ? theme.colors.dark[5] : theme.white,
      borderRadius: theme.radius.sm,
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      zIndex: 10,
      overflow: "hidden",
      border: `1px solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
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

    dropdownItem: {
      cursor: "pointer",
      color: isDark ? theme.white : theme.black,
      fontSize: "16px",
      flexGrow: 1,
    },

    editFoodItemButton: {
      cursor: "pointer",
      color: isDark ? theme.colors.blue[4] : theme.colors.blue[6],
      fontSize: "14px",
      padding: "5px",
      "&:hover": {
        color: theme.colors.blue[7],
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
  };
});
