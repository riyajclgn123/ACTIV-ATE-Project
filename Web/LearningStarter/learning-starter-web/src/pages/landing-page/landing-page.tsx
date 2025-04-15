import { Box, Card, Container, Space, Text } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import bgImage from "../../assets/bg.jpeg";
import { RingProgress } from "@mantine/core";
import { useState } from "react";
import { ExerciseLogListing } from "../ExerciseLogs-page/exerciselog-listing";
import { FoodLogListing } from "../Foodlogs-page/food-logs-listing";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const [hovered, setHovered] = useState<string | null>(null);
  const reset = () => setHovered(null);

  return (
    <>
      <section id="backgrounddesign">
        <div className={classes.container1}>
          {/* Text overlay on background */}
          <div className={classes.overlayText}>
            <p className={classes.quote}>
              "Your Journey to a Healthier You Starts Here!"
            </p>
            <p>Welcome to your personalized fitness companion!</p>
            <p className={classes.threeword}>Track. Plan. Achieve.</p>
          </div>
        </div>
      </section>

      <section id="after background design" className={classes.afterBackground}>
        {/* <div className={classes.container2}>Start your Journey with adding your Exercise and Food to track our health </div>
        <div className={classes.photocontainer}>
          <div className={classes.box}><img src={exercise} style={{width:"400px", height:"400px"}} /><p>Explain photo</p></div>
          <div className={classes.box}><img src={food} style={{width:"400px", height:"400px"}} /><p>Explain photo</p></div>
        </div> */}

        <Container>
          <Card withBorder shadow="sm" p="lg">
            <Text size="25px" style={{ fontWeight: "bold" }}>
              {" "}
              Calories Consumed{" "}
            </Text>
            <div className={classes.coursel}>
              <RingProgress
                label={
                  <Text size="lg" ta="center" style={{ fontWeight: "bold" }}>
                    {hovered || "1,273 Remaining"}
                  </Text>
                }
                size={300}
                thickness={20}
                sections={[
                  {
                    value: 40,
                    color: "cyan",
                    onMouseEnter: () => setHovered("Breakfast"),
                    onMouseLeave: reset,
                  },
                  {
                    value: 20,
                    color: "blue",
                    onMouseEnter: () => setHovered("Snack"),
                    onMouseLeave: reset,
                  },
                  {
                    value: 15,
                    color: "indigo",
                    onMouseEnter: () => setHovered("Lunch"),
                    onMouseLeave: reset,
                  },
                  {
                    value: 12,
                    color: "red",
                    onMouseEnter: () => setHovered("Dinner"),
                    onMouseLeave: reset,
                  },
                ]}
              />

              <div className={classes.text}>
                <Space h="sm" />
                <Text
                  size="18px"
                  ta="center"
                  mt="lg"
                  style={{ fontWeight: "bold" }}
                >
                  {" "}
                  Base Goal{" "}
                </Text>
                <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                  {" "}
                  1500 kcal{" "}
                </Text>
                <Space h="sm" />
                <Text
                  size="18px"
                  ta="center"
                  mt="lg"
                  style={{ fontWeight: "bold" }}
                >
                  {" "}
                  Food Count{" "}
                </Text>
                <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                  {" "}
                  2{" "}
                </Text>
                <Space h="sm" />
                <Text
                  size="18px"
                  ta="center"
                  mt="lg"
                  style={{ fontWeight: "bold" }}
                >
                  {" "}
                  Exercise Count{" "}
                </Text>
                <Text size="16px" ta="center" mt="md" style={{ color: "gray" }}>
                  {" "}
                  3{" "}
                </Text>
                <Space h="sm" />
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <Container className={classes.exerciselog}>
        <Card withBorder shadow="sm" p="lg">
          <ExerciseLogListing />
        </Card>
      </Container>

      <Container className={classes.foodlog}>
        <Card withBorder shadow="sm" p="lg">
          <FoodLogListing />
        </Card>
      </Container>

      <section></section>
    </>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },

    container1: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative", // Ensure text is positioned over the background image
      color: "white", // Make text white so it stands out against the image
      fontSize: "25px",
      height: "600px", // Make sure the container takes full height of the screen
      width: "100%", // Full width of the container
      backgroundImage: `url(${bgImage})`, // Set the background image
      backgroundSize: "cover", // Ensure the image covers the full container
      backgroundPosition: "center", // Center the image in the container
      backgroundRepeat: "no-repeat", // Prevent repeating the background image
      overflow: "hidden", // Prevent text overflow

      [`@media (maxWidth: 1024px)`]: {
        height: "500px", // Reduce height for smaller screens like tablets
      },

      [`@media (maxWidth: 768px)`]: {
        height: "400px", // Further reduce height for mobile screens
      },

      [`@media (maxWidth: 480px)`]: {
        height: "300px", // Keep height smaller for mobile
      },
    },

    overlayText: {
      position: "absolute", // To position the text above the background
      color: "white", // White text color for better contrast
      textAlign: "center", // Center the text horizontally
      fontSize: "30px", // Default font size for text
      fontWeight: "bold", // Bold the text
      maxWidth: "60%", // Limit the text width for better readability
      zIndex: 1, // Make sure text is above the background image
      wordWrap: "break-word", // Ensure text wraps within the container

      [`@media (maxWidth: 768px)`]: {
        fontSize: "20px", // Adjust font size for smaller screens
        maxWidth: "80%", // Increase text width for mobile
      },

      [`@media (maxWidth: 480px)`]: {
        fontSize: "18px", // Further adjust font size for mobile
        maxWidth: "90%", // Make the text width even larger for mobile
      },
    },

    quote: {
      fontSize: "35px", // Larger font size for the quote
      marginBottom: "10px", // Add space below the quote

      [`@media (maxWidth: 768px)`]: {
        fontSize: "2rem", // Smaller font size for mobile
      },

      [`@media (maxWidth: 480px)`]: {
        fontSize: "1.5rem", // Further reduce font size for smaller devices
      },
    },

    threeword: {
      fontSize: "35px", // Font size for the "Track. Plan. Achieve." text
      fontWeight: "bold",
      marginTop: "20px", // Add space above the "Track. Plan. Achieve." text

      [`@media (maxWidth: 768px)`]: {
        fontSize: "25px", // Adjust font size for tablets
      },

      [`@media (maxWidth: 480px)`]: {
        fontSize: "18px", // Reduce font size further for small screens
      },
    },

    button: {
      backgroundColor: "#4263eb", // Button color
      border: "none", // Remove border
      color: "white", // Button text color
      padding: "10px 20px", // Ensure buttons are comfortably clickable

      [`@media (maxWidth: 768px)`]: {
        padding: "8px 15px", // Adjust button padding for tablets
      },

      [`@media (maxWidth: 480px)`]: {
        padding: "6px 10px", // Further reduce button padding for small devices
      },
    },

    // Section 2 id="after background design"
    container2: {
      margin: "50px 20px",
      fontSize: "2rem",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",

      [`@media (maxWidth: 768px)`]: {
        fontSize: "1.5rem", // Adjust font size for smaller screens like tablets
      },

      [`@media (maxWidth: 480px)`]: {
        fontSize: "1.2rem", // Smaller font size for mobile screens
      },
    },

    photocontainer: {
      display: "flex",
      justifyContent: "center", // Space out the items (photos)
      alignItems: "center", // Vertically align the photos
      flexWrap: "wrap",
      gap: "10px",

      [`@media (maxWidth: 1024px)`]: {
        gap: "15px", // Slightly reduce gap for medium screens (tablets)
        padding: "15px", // Adjust padding for tablets
      },

      [`@media (maxWidth: 768px)`]: {
        gap: "10px", // Reduce gap further for smaller screens
        padding: "10px", // Further adjust padding
      },

      [`@media (maxWidth: 480px)`]: {
        flexDirection: "column", // Stack the photos vertically for mobile devices
        gap: "15px", // Add space between vertically stacked photos
        padding: "10px", // Adjust padding for mobile screens
      },
    },

    exerciselog: {
      marginTop: "30px",
      marginBottom: "30px",
    },

    foodlog: {
      marginTop: "30px",
      marginBottom: "30px",
    },

    box: {},

    coursel: {
      backgroundColor: "white",
      gap: "100px",
      flexDirection: "row",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      [`@media (maxWidth: 768px)`]: {
        flexDirection: "column", // Stack carousel items for smaller screens
      },
    },

    authentication: {
      margin: "20px 0px 20px 0px",
      fontFamily: "Roboto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      [`@media (maxWidth: 768px)`]: {
        flexDirection: "column", // Stack authentication elements on smaller screens
        gap: "10px", // Space between items
      },
    },
    text: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    afterBackground: {
      marginTop: "50px",
    },
  };
});
