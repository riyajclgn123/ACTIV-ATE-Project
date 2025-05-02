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
                <Container className={classes.headerSection}>
                    <Group
                        mb="30px"
                        gap={"lg"}
                    >
                        <Button
                            onClick={() => navigate(routes.foodLog)}
                            leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                            color="red"
                            variant="outline"
                        >
                            Back To Log
                        </Button>
                        <Button
                            onClick={() => navigate(routes.foodCreate)}
                            leftSection={<FontAwesomeIcon icon={faPlus} />}
                            variant="outline"
                        >
                            Create New Food
                        </Button>
                    </Group>
                    <div className={classes.searchContainer}>
                        <TextInput
                            placeholder="Search for a food..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.currentTarget.value)
                            }
                            className={classes.searchbox}
                            leftSection={<FontAwesomeIcon icon={faSearch} />}
                            radius="md"
                        />

                        {filteredFoods.length > 0 && (
                            <div className={classes.dropdown}>
                                {filteredFoods.map((food) => (
                                    <div
                                        key={food.id}
                                        className={
                                            classes.dropdownItemContainer
                                        }
                                        onClick={() => handleFoodClick(food)}
                                    >
                                        <div className={classes.dropdownItem}>
                                            {food.name}
                                        </div>
                                        <FontAwesomeIcon
                                            className={
                                                classes.editFoodItemButton
                                            }
                                            icon={faPencil}
                                            onClick={(event) =>
                                                handleEditClick(food.id, event)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                </Container>
            </Container>
        </>
    );
};

const useStyles = createStyles((theme) => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    return {
        container: {
            display: "flex",
            flexDirection: "column",
            color: colorScheme === "dark" ? "white" : "black",
            fontSize: "20px",
            margin: "0px",
            minHeight: "100vh",
            width: "100%",
            padding: "20px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        },

        headerSection: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "30px",
            width: "100%",
            padding: "30px",
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
                backgroundColor: isDark
                    ? theme.colors.dark[4]
                    : theme.colors.gray[0],
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
    };
});
