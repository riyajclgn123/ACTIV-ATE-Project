import { useEffect, useState } from "react";
 import { useNavigate, useLocation } from "react-router-dom";
 import {
     NumberInput,
     Button,
     Group,
     Box,
     Text,
     Title,
     Card,
     TextInput,
     Select,
     Stack,
     LoadingOverlay,
     Container,
 } from "@mantine/core";
 import { routes } from "../../routes";
 import api from "../../config/axios";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import {
     faArrowLeft,
     faArrowRight,
     faCheck,
     faHistory,
 } from "@fortawesome/free-solid-svg-icons";
 import { showNotification } from "@mantine/notifications";
 import { createStyles } from "@mantine/emotion";
 
 interface FoodLogResponse {
     data: {
         id: number;
         calories: number;
         protein: number;
         carbs: number;
         fat: number;
     };
 }
 
 export const FoodLogCreate = () => {
     const { classes } = useStyles();
     const location = useLocation();
     const navigate = useNavigate();
     const [servings, setServings] = useState<number>(1);
     const [unit, setUnit] = useState<string>("Servings");
     const [isLoading, setIsLoading] = useState(false);
     const [foodDetails, setFoodDetails] = useState<any>(null);
     const [calories, setCalories] = useState<number>(0);
     const [protein, setProtein] = useState<number>(0);
     const [carbs, setCarbs] = useState<number>(0);
     const [fat, setFat] = useState<number>(0);
 
     const units = [
         { value: "Servings", label: "Servings" },
         { value: "Grams", label: "Grams" },
         { value: "Ounces", label: "Ounces" },
     ];
 
     const { food, userId } =
         (location.state as {
             food: { id: number; name: string };
             userId: number;
         }) || {};
 
     useEffect(() => {
         async function fetchFoodDetails() {
             setIsLoading(true);
             try {
                 const response = await api.get<FoodLogResponse>(
                     `/api/foods/${food.id}`
                 );
                 if (response.data.data) {
                     setFoodDetails(response.data.data);
                     calculateNutrition(response.data.data, servings, unit);
                 }
             } catch (error) {
                 console.error("Error fetching food details:", error);
             } finally {
                 setIsLoading(false);
             }
         }
         if (food?.id) {
             fetchFoodDetails();
         }
     }, [food.id, servings, unit]);
 
     if (!food?.id || !userId) {
         return (
             <Box maw={600} mx="auto" p="md">
                 <Card withBorder shadow="sm" p="lg">
                     <Text color="red" mb="md">
                         Missing food or user information. Please select a food
                         item from the list.
                     </Text>
                     <Button
                         onClick={() => navigate(routes.foods)}
                         leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                     >
                         Back to Foods
                     </Button>
                 </Card>
             </Box>
         );
     }
 
     const handleSubmit = async () => {
         setIsLoading(true);
         try {
             if (!food?.id || !userId) {
                 throw new Error("Missing food or user information");
             }
 
             if (isNaN(servings) || servings <= 0) {
                 throw new Error("Please enter the number of servings");
             }
 
             const response = await api.post<FoodLogResponse>("/api/food-logs", {
                 foodId: food.id,
                 userId: userId,
                 servings: servings,
                 createDate: new Date().toISOString(),
             });
             if (response.data.data) {
                 showNotification({
                     title: "Success",
                     message: "Food logged successfully",
                     color: "green",
                 });
                 navigate(routes.foodLog);
             }
         } catch (error: any) {
             console.error("Error logging food:", error);
             showNotification({
                 title: "Error",
                 message:
                     error.response?.data?.errors?.join(", ") ||
                     error.message ||
                     "Failed to log food",
                 color: "red",
             });
         } finally {
             setIsLoading(false);
         }
     };
 
     const calculateNutrition = (
         foodData: any,
         servingAmount: number,
         unitType: string
     ) => {
         console.log("Calculating nutrition...");
         console.log("Food Data:", foodData);
         console.log("Serving Amount:", servingAmount);
         console.log("Unit Type:", unitType);
 
         if (!foodData) return;
 
         const baseCalories = foodData.calories || 0;
         const baseProtein = foodData.protein || 0;
         const baseCarbs = foodData.carbohydrates || 0;
         const baseFat = foodData.fat || 0;
 
         let multiplier = servingAmount;
         if (unitType === "Grams" && foodData.servingSizeGrams) {
             multiplier = servingAmount / foodData.servingSizeGrams;
         } else if (unitType === "Ounces" && foodData.servingSizeGrams) {
             // Convert ounces to grams (1 oz ≈ 28.35g) then calculate
             multiplier = (servingAmount * 28.35) / foodData.servingSizeGrams;
         }
         setCalories(baseCalories * multiplier);
         setProtein(baseProtein * multiplier);
         setCarbs(baseCarbs * multiplier);
         setFat(baseFat * multiplier);
     };
 
     return (
         <Box maw={600} mx="auto" p="md" pos="relative">
             <LoadingOverlay visible={isLoading} />
             <Container className={classes.buttonsContainer}>
                 <Button
                     variant="outline"
                     color="red"
                     onClick={() => navigate(routes.foods)}
                     leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                 >
                     Back to Foods
                 </Button>
                 <Button
                     variant="outline"
                     onClick={() => navigate(routes.foodLog)}
                     leftSection={<FontAwesomeIcon icon={faHistory} />}
                 >
                     View My Logs
                 </Button>
             </Container>
 
             <Title order={2} mb="xl">
                 Log: {food.name}
             </Title>
 
             <Card withBorder shadow="sm" p="lg">
                 <Stack>
                     {/* Duration Input */}
                     <Group align="flex-end" grow>
                         <NumberInput
                             label="Servings"
                             value={servings}
                             onChange={(value) => {
                                 const newServings = Number(value) || 1;
                                 setServings(newServings);
                                 calculateNutrition(
                                     foodDetails,
                                     newServings,
                                     unit
                                 );
                             }}
                             min={1}
                             required
                         />
                         <Select
                             label="Unit"
                             value={unit}
                             onChange={(val) => {
                                 const newUnit = val || "Serving";
                                 setUnit(newUnit);
                                 calculateNutrition(
                                     foodDetails,
                                     servings,
                                     newUnit
                                 );
                             }}
                             data={units}
                             required
                         />
                     </Group>
 
                     {/* Nutrition Facts */}
                     <Title order={5} mb="md">
                         Nutrition Facts
                     </Title>
                     <Card
                         mt="sm"
                         withBorder
                         p="lg"
                         radius="sm"
                         style={{
                             textAlign: "left",
                             fontFamily: "'Helvetica', 'Arial', sans-serif",
                         }}
                     >
                         <Text size="lg" fw={700} mb="xs">
                             Nutrition Information
                         </Text>
                         <Text size="sm" c="dimmed" mb="md">
                             Based on {servings} {unit.toLowerCase()}.
                         </Text>
                         <Group justify="space-between" mb="md">
                             <Text size="md" fw={700}>
                                 Calories
                             </Text>
                             <Text size="md" fw={700}>
                                 {Math.round(calories)}
                             </Text>
                         </Group>
 
                         <div
                             style={{
                                 height: "1px",
                                 background: "#ddd",
                                 margin: "10px 0",
                             }}
                         ></div>
                         <Group justify="space-between" my="xs">
                             <Text size="sm">Total Fat</Text>
                             <Text size="sm">{Math.round(fat)} g</Text>
                         </Group>
                         <Group justify="space-between" my="xs">
                             <Text size="sm">Total Carbohydrates</Text>
                             <Text size="sm">{Math.round(carbs)} g</Text>
                         </Group>
                         <Group justify="space-between" my="xs">
                             <Text size="sm">Protein</Text>
                             <Text size="sm">{Math.round(protein)} g</Text>
                         </Group>
                         <div
                             style={{
                                 height: "1px",
                                 background: "#ddd",
                                 margin: "10px 0",
                             }}
                         ></div>
                         <Group justify="space-between" mt="md">
                             <Text size="xs" c="dimmed">
                                 g: grams
                             </Text>
                         </Group>
                     </Card>
 
                     {/* Submit Button */}
                     <Group mt="xl">
                         <Button
                             onClick={handleSubmit}
                             loading={isLoading}
                             size="md"
                             disabled={!servings || isNaN(servings)}
                             rightSection={<FontAwesomeIcon icon={faCheck} />}
                         >
                             Log {food.name}
                         </Button>
                     </Group>
 
                     <Text size="xs" c="dimmed" mt="xs">
                         *Nutrition values are estimates based on the food
                         database.
                     </Text>
                 </Stack>
             </Card>
         </Box>
     );
 };
 
 const useStyles = createStyles(() => {
     return {
         buttonsContainer: {
             padding: "20px",
             display: "flex",
             justifyContent: "space-around",
             alignItems: "center",
             marginBottom: "20px",
         },
     };
 });