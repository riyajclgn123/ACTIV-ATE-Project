import { useEffect, useState } from "react";
import { ApiResponse, FoodGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { useAuth } from "../../authentication/use-auth";

import {
  Button,
  Container,
  Flex,
  Group,
  Space,
  Table,
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
} from "@fortawesome/free-solid-svg-icons";
import foodbgImage from "../../assets/foodbg.jpg";

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

  return (
    <>
      <Container
        className={classes.container}
        fluid
        p={0}
        style={{ maxWidth: "100vw" }}
      >
        <Container className={classes.overlayText}>
          <h2>Insert your Food</h2>
          <TextInput
            placeholder="Search for a food.."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            className={classes.searchbox}
          />

          {filteredFoods.length > 0 && (
            <div className={classes.dropdown}>
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className={classes.dropdownItemContainer}
                  onClick={() => handleFoodClick(food)}
                >
                  <div
                    className={classes.dropdownItem}
                    onClick={() => {
                      handleFoodClick(food);
                    }}
                  >
                    {food.name}
                  </div>
                  <FontAwesomeIcon
                    className={classes.editFoodItemButton}
                    icon={faPencil}
                    onClick={(event) => {
                      handleEditClick(food.id, event);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <Space h="md" />
          <Container className={classes.buttonContainer}>
            <Button
              onClick={() => navigate(routes.foodLog)}
              leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
              variant="outline"
              color="red"
            >
              Back To Log
            </Button>
            <Button
              onClick={() => {
                navigate(routes.foodCreate);
              }}
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              variant="outline"
              color="blue"
            >
              Create Food
            </Button>
          </Container>
        </Container>
      </Container>
    </>
  );
};

const useStyles = createStyles(() => {
  const { colorScheme } = useMantineColorScheme(); // 'light' | 'dark' | 'auto'
  return {
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

    buttonContainer: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
      margin: "20px",
    },

    dropdownItemContainer: {
      display: "flex",
      justifyContent: "space-between",
      cursor: "pointer",
      alignItems: "center",
      width: "100%",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },

    dropdownItem: {
      padding: "5px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
      color: "black",
      fontSize: "20px",
    },

    editFoodItemButton: {
      cursor: "pointer",
      color: "black",
      "&:hover": {
        color: "blue",
      },
    },

    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: colorScheme === "dark" ? "white" : "black",
      fontSize: "20px",
      margin: "0px",
      minHeight: "100vh",
      width: "100%",
      padding: "10px",
      backgroundImage: `linear-gradient(
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)
              ),url(${foodbgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    overlayText: {
      position: "absolute",
      color: colorScheme === "dark" ? "white" : "black",
      alignSelf: "center",
      textAlign: "center",
      fontSize: "30px",
      fontWeight: "bold",
      zIndex: 1,
      wordWrap: "break-word",
      whiteSpace: "nowrap",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "80%",
    },

    searchbox: {
      color: "black",
      fontSize: "20px",
      position: "relative",
      width: "100%",
      maxWidth: "300px",
      padding: "0px",
    },
  };
});
