import { useEffect, useState } from "react";
import { ApiResponse, FoodGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { Button, Container, Flex, Group, Space, Table, TextInput, Title } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import foodbgImage from '../../assets/foodbg.jpg';


//import { Header } from "@mantine/core";

export const FoodListing = () => {
    const navigate = useNavigate();
    const {classes} = useStyles();
    const [foods, setFoods] = useState<FoodGetDto[]>([]);
     const [searchQuery, setSearchQuery] = useState("");
        const [filteredFoods, setFilteredFoods] = useState<FoodGetDto[]>([]);
    

  useEffect (() => {
    fetchFoods();
      async function fetchFoods() {
        const response = await api.get<ApiResponse<FoodGetDto[]>>(
          "/api/foods"
        );
        if (response.data.hasErrors) {
          showNotification ({message: "Error fetching exercises"});
        }
        if(response.data.data) {
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


  return (
    <>
    <Container>
        <Flex direction="row" justify={"space-between"} >
            <Title order={2}>Foods</Title>
            <Button onClick = {() => {
            navigate(routes.foodCreate);
            }
         }>
            <FontAwesomeIcon icon={faPlus} />
            <Space w={8} /> 
            New Food
        </Button>
        </Flex>
      <Space h="md"/>
      <h1>Foods</h1>
      <p>Foods page content goes here.</p>
      {foods && (
        <Table withColumnBorders striped >
          <thead>
            <tr> 
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => {
              return (
              <tr>
                <td>
                    <FontAwesomeIcon 
                    className={classes.iconButton} 
                    icon={faPencil} 
                    onClick={() => {
                      navigate(routes.foodUpdate.replace(":id", `${food.id}`)
                    );
                    }}
                    />
                </td>
                <td>{food.name}</td>
                <td>{food.description}</td>
              </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      
    </Container>

    <section>
        <div className={classes.container}>
          <div className={classes.overlayText}>
            <h2>Insert your Food</h2>
            <TextInput
              //label="Search"
              placeholder="Search for an food.."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              className={classes.searchbox}
            />
            {/* Do Search Bar */}
    
            {/* Search Dropdown */}
            {filteredFoods.length > 0 && (
                  <div className={classes.dropdown}>
                    {filteredFoods.map((food) => (
                      <div 
                        key={food.id} 
                        className={classes.dropdownItem} 
                        onClick={() => setSearchQuery(food.name)}
                      >
                        {food.name}
                      </div>
                    ))}
                  </div>
                )}
          </div>
        </div>
         
        </section>
        <section>
            <Group gap={50} className={classes.donutchart}>
              <div >
                <div>
                  Calories Burned
                </div>
              </div>
              </Group>
            </section>
    </>
  );
};

const useStyles = createStyles (() =>{
    return {
        iconButton: {
            cursor: "pointer",
            color: "black",
            "&:hover": {
                color: "blue",
            },
        },
        foodListingContainer: {
            padding: "20px",
        },
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
          container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",  // Ensure text is positioned over the background image
            color: "white",
            fontSize: "20px",
            margin: "0px",
            height: "600px",  // Make sure the container takes full height of the screen
            width: "100%",  // Full width of the container
            backgroundImage: `url(${foodbgImage})`,  // Set the background image
            backgroundSize: "cover",  // Ensure the image covers the full container
            backgroundPosition: "center",  // Center the image in the container
            backgroundRepeat: "no-repeat",  // Prevent repeating the background image
            padding: "10px",
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
          position: "absolute",  // To position the text above the background
          color: "white",  // White text color for better contrast
          textAlign: "center",  // Center the text horizontally
          fontSize: "30px",  // Default font size for text
          fontWeight: "bold",  // Bold the text
          maxWidth: "80%",  // Limit the text width for better readability
          zIndex: 1,  // Make sure text is above the background image
          [`@media (max-width: 768px)`]: {
            fontSize: "24px",
          },
        },
        searchbox: {
          color:"black",
          fontSize: "20px",
          position: "relative",
          width:"100%",
          maxWidth: "300px", // Keeps it from stretching too much
          padding: "5px",
        },
        
          water:{
            marginRight:" 1000px",
            marginLeft:"10px",
            marginBottom:"10px",
            alignItem: "left",
            flex:"display",
            justifyCenter:"center",
          },

          donutchart:{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            fontSize:"50px",
            fontFamily:"Roboto",
            fontWeight: "bold",
            gap:"10px",
            margin:"30px 0px",
          
            [`@media (maxWidth: 1024px)`]: {
              fontSize: "40px",
            },
        
            [`@media (maxWidth: 768px)`]: {
              fontSize: "35px",
            },
        
            [`@media (maxWidth: 480px)`]: {
              fontSize: "28px",
            },
        },
    
    }
})