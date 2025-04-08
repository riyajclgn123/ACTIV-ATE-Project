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
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { faHistory, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import foodbgImage from "../../assets/foodbg.jpg";

//import { Header } from "@mantine/core";

export const FoodListing = () => {
    const navigate = useNavigate();
    const { classes } = useStyles();
    const [foods, setFoods] = useState<FoodGetDto[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFoods, setFilteredFoods] = useState<FoodGetDto[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchFoods();
        async function fetchFoods() {
            const response = await api.get<ApiResponse<FoodGetDto[]>>(
                "/api/foods"
            );
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
                userId: user.id, // Pass the authenticated user's ID
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
                style={{ maxWidth: "auto" }}
            >
                <Container className={classes.overlayText}>
                    <h2>Insert your Food</h2>
                    <TextInput
                        //label="Search"
                        placeholder="Search for a food.."
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.currentTarget.value)
                        }
                        className={classes.searchbox}
                    />
                    {/* Do Search Bar */}

                    {/* Search Dropdown */}
                    {filteredFoods.length > 0 && (
                        <div className={classes.dropdown}>
                            {filteredFoods.map((food) => (
                                <div
                                    key={food.id}
                                    className={classes.dropdownItemContainer}
                                    onClick={() => setSearchQuery(food.name)}
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
                                            className={
                                                classes.editFoodItemButton
                                            }
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
                            onClick={() => {
                                navigate(routes.foodCreate);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <Space w={8} />
                            New Food
                        </Button>

                        <Button onClick={() => navigate(routes.foodLog)}>
                            <FontAwesomeIcon icon={faHistory} />
                            <Space w={8} />
                            Food Logs
                        </Button>
                    </Container>
                </Container>
            </Container>
        </>
    );
};

const useStyles = createStyles(() => {
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
            alignItems: "center",
            width: "100%",
            borderBottom: "1px solid #eee",
            "&:hover": {
                backgroundColor: "#f5f5f5",
            },
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
            position: "relative", // Ensure text is positioned over the background image
            color: "white",
            fontSize: "20px",
            margin: "0px",
            height: "600px", // Make sure the container takes full height of the screen
            width: "100vw", // Full width of the container
            backgroundImage: `url(${foodbgImage})`, // Set the background image
            backgroundSize: "cover", // Ensure the image covers the full container
            backgroundPosition: "center", // Center the image in the container
            backgroundRepeat: "no-repeat", // Prevent repeating the background image
            padding: "0px",
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
            maxWidth: "300px", // Keeps it from stretching too much
            padding: "0px",
        },
    };
});
