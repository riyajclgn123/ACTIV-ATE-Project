import { Container, Text } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import food from "../../assets/foodtracking.jpg";
import exercise from "../../assets/fitnesstracking.png";
import setup from "../assets/setup1.jpg";
import transform from "../assets/transform.jpg";
import protein from "../assets/okay11.jpg";
import pregnancy from "../assets/pregnancy1.jpg";
import meal from "../assets/meal.png";
import intermediate from "../assets/intermediate.jpg";
import bgImage from '../../assets/bg.jpeg';


//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  return (
    <>
    <Container className={classes.homePageContainer}>
      <Text size="lg">Home Page</Text>
    </Container>


    <section id="backgrounddesign">
    <div className={classes.container1}>
      {/* Text overlay on background */}
      <div className={classes.overlayText}>
        <p className={classes.quote}>
          "Your Journey to a Healthier You Starts Here!"
        </p>
        <p>
          Welcome to your personalized fitness companion!
        </p>
        <p className={classes.threeword}>
          Track. Plan. Achieve.
        </p>

        {/* <Drawer 
        offset={8} 
        radius="md" 
        opened={opened} 
        onClose={close} 
        title="Authentication" 
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
        >
    <div>
      <h2> Register an account</h2>
      <form>
            <div className={classes.authentication}>
              <label>First Name: </label>
              <input
                type="text"
                name="firstName"
                required
              />
            </div>

            <div className={classes.authentication}>
              <label>Last Name: </label>
              <input
                type="text"
                name="lastName"
                required
              />
            </div>

        <div className={classes.authentication}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            required
          />
        </div>
            <div className={classes.authentication}>
              <label>Create Password: </label>
              <input
                type="password"
                name="password"
                required
              />
            </div>

            <div className={classes.authentication}>
              <label>Verify Password: </label>
              <input
                type="password"
                name="verifyPassword"
                required
              />
            </div>

            <div className={classes.authentication}>
              <label>Height (in cm): </label>
              <input
                type="number"
                name="height"
                required
              />
            </div>

            <div className={classes.authentication}>
              <label>Age: </label>
              <input
                type="number"
                name="age"
                required
              />
            </div>

            <div className={classes.authentication}>
              <label>Weight (kg): </label>
              <input
                type="number"
                name="weight"
                required
              />
            </div>
            <div className={classes.authentication}>
            <Button type="submit" >Register</Button>
            </div>
        
      </form>

      <p>
          <span className={classes.authentication}>
            Already have an account? 
            
          </span>
          <div className={classes.authentication}>
          <Button >Login here</Button>
          </div>
          
      </p>
    </div>

      </Drawer> */}
{/* 
      <Button variant="default" onClick={open} className={classes.button} size="lg" color="blue">
        Login || Register 
      </Button>
        */}


      </div>
    </div>
    </section>

    <section id="after background design">
        <div className={classes.container2}>Start your Journey with adding your Exercise and Food to track our health </div>
        <div className={classes.photocontainer}>
          <div className={classes.box}><img src={exercise} style={{width:"400px", height:"400px"}} /><p>Explain photo</p></div>
          <div className={classes.box}><img src={food} style={{width:"400px", height:"400px"}} /><p>Explain photo</p></div>
        </div>

    </section>

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
      margin: "0px 0px", // Center align the text
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
  
    box: {
    
  
    },
  
  
  
    coursel: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      margin: "5px",
  
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


  };
});
