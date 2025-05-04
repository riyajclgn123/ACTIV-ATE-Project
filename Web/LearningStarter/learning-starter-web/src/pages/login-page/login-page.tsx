import { ApiResponse, UserCreateDto } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  createTheme,
  Group,
  Input,
  NumberInput,
  Radio,
  Space,
  Text,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { useEffect, useRef, useState } from "react";
import backgroundVideo from "../../assets/bgvideo3.mp4";
import SignUpForm from "./signup";

type LoginRequest = {
  userName: string;
  password: string;
};

type SignUpRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  dateofBirth: string;
  gender: string;
  height: number;
  weight: number;
  password: string;
  confirmPassword: string;
};

const theme = createTheme({
  fontFamily: "Montserrat, sans-serif",
  headings: {
    fontFamily: "Montserrat, sans-serif",
  },
});
type LoginResponse = ApiResponse<boolean>;

//This is a *fairly* basic form
//The css used in here is a good example of how flexbox works in css
//For more info on flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
export const LoginPage = ({
  fetchCurrentUser,
}: {
  fetchCurrentUser: () => void;
}) => {
  const styles = useStyles();
  const { classes } = styles;
  const [isSignUp, setIsSignUp] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    }
  }, []);

  const loginForm = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) =>
        value.length <= 0 ? "Username must not be empty" : null,
      password: (value) =>
        value.length <= 0 ? "Password must not be empty" : null,
    },
  });

  const signUpForm = useForm<SignUpRequest>({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      dateofBirth: "",
      gender: "",
      height: 0,
      weight: 0,
      password: "",
      confirmPassword: "",
    },
    validate: {
      firstName: (value) =>
        value.length <= 0 ? "First name is required" : null,
      lastName: (value) => (value.length <= 0 ? "Last name is required" : null),
      userName: (value) => (value.length <= 0 ? "Username is required" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      dateofBirth: (value) => (value ? null : "Date of birth is required"),
      gender: (value) => (value ? null : "Gender is required"),
      height: (value) => (value ? null : "Height is required"),
      weight: (value) => (value ? null : "Weight is required"),
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const [, submitLogin] = useAsyncFn(async (values: LoginRequest) => {
    const response = await api.post<LoginResponse>(`/api/authenticate`, values);
    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      loginForm.setErrors(formErrors);
    }

    if (response.data.data) {
      showNotification({ message: "Successfully Logged In!", color: "green" });
      fetchCurrentUser();
    }
  }, []);

  const [, submitSignUp] = useAsyncFn(async (values: SignUpRequest) => {
    const signUpData = {
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      dateofBirth: values.dateofBirth,
      gender: values.gender,
      height: values.height,
      weight: values.weight,
    };

    try {
      const response = await api.post<ApiResponse<UserCreateDto>>(
        "/api/users",
        signUpData
      );

      if (response.data.hasErrors) {
        const formErrors: FormErrors = response.data.errors.reduce(
          (prev, curr) => {
            Object.assign(prev, { [curr.property]: curr.message });
            return prev;
          },
          {} as FormErrors
        );
        signUpForm.setErrors(formErrors);
        return;
      }

      if (response.data.data) {
        showNotification({
          message: "User created successfully!",
          color: "green",
        });

        signUpForm.reset();

        setIsSignUp(false);

        loginForm.setFieldValue("userName", values.userName);
      }
    } catch (error) {
      showNotification({
        message: "Network error while creating user",
        color: "red",
      });
    }
  }, []);

  return (
    <PageWrapper>
      <div className={classes.videoContainer}>
        <video
          ref={videoRef}
          className={classes.videoBackground}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className={classes.mainContainer}>
        <div className={classes.splitContainer}>
          {/* Left side - Title section */}
          <div className={classes.titleSection}>
            <Text className={classes.mainTitle1}>Welcome to</Text>

            <Text className={classes.mainTitle}>Activ-Ate</Text>
            <Text className={classes.subTitle}>
              Health 🔸 Wellness 🔸 Fitness
            </Text>
          </div>

          {/* Right side - Login/Signup card */}
          <div className={classes.formSection}>
            <Container px={0}>
              {!isSignUp ? (
                <>
                  {loginForm.errors[""] && (
                    <Alert className={classes.generalErrors} color="red">
                      <Text>{loginForm.errors[""]}</Text>
                    </Alert>
                  )}
                  <Space h="lg" />
                  <Card
                    withBorder
                    shadow="sm"
                    style={{
                      width: "27vw",
                      height: "60vh",
                      padding: "2vw",
                    }}
                    className={classes.container1}
                  >
                    <form onSubmit={loginForm.onSubmit(submitLogin)}>
                      <Text
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: "2vw",
                          fontWeight: "500",

                          color: "white",
                          marginBottom: "20px",
                        }}
                      >
                        Log In Your Account
                      </Text>
                      <Container px={0}>
                        <Container className={classes.formField} px={0}>
                          <Container px={0}>
                            <label htmlFor="userName">Username</label>
                          </Container>
                          <Input
                            placeholder="Enter your Username"
                            {...loginForm.getInputProps("userName")}
                          />
                          <Text c="red">{loginForm.errors["userName"]}</Text>
                        </Container>
                        <Container className={classes.formField} px={0}>
                          <Container px={0}>
                            <label htmlFor="password">Password</label>
                          </Container>
                          <Input
                            type="password"
                            placeholder="Enter your Password"
                            {...loginForm.getInputProps("password")}
                          />
                          <Text c="red">{loginForm.errors["password"]}</Text>
                        </Container>

                        <Container
                          px={0}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "25px",
                            marginTop: "40px",
                          }}
                        >
                          <Button
                            className={classes.loginButton}
                            type="submit"
                            color="#b20030"
                            variant="filled"
                          >
                            Login
                          </Button>
                          <Button
                            className={classes.loginButton}
                            color="blue"
                            type="button"
                            variant="filled"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsSignUp(true);
                            }}
                          >
                            Sign Up
                          </Button>
                        </Container>
                      </Container>
                    </form>
                  </Card>
                </>
              ) : (
                <SignUpForm
                  signUpForm={signUpForm}
                  submitSignUp={submitSignUp}
                  setIsSignUp={setIsSignUp}
                />
              )}
            </Container>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const useStyles = createStyles(() => {
  return {
    videoContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      overflow: "hidden",
    },
    videoBackground: {
      objectFit: "cover",
      width: "100%",
      height: "100%",
      //opacity: 0.8,
    },
    generalErrors: {
      marginBottom: "8px",
      color: "#ff6b6b",
      fontWeight: 500,
    },

    loginButton: {
      marginTop: "8px",
      borderRadius: "30px",

      transition: "background-color 0.3s, transform 0.2s",
      ":hover": {
        backgroundColor: "#1e90ff",
        transform: "scale(1.02)",
      },
    },

    formField: {
      marginBottom: "8px",
    },

    mainContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100%",
      padding: "20px",
    },

    splitContainer: {
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      gap: "40px",
    },

    titleSection: {
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      color: "white",
      padding: "50px",
      textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
    },

    mainTitle1: {
      fontSize: "2rem",
      fontWeight: 200,
      lineHeight: 1.2,
      width: "100%",
      marginBottom: "10px",
      fontFamily: "Montserrat, sans-serif",
      textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
    },
    mainTitle: {
      fontSize: "4rem",
      fontWeight: 600,
      lineHeight: 1.2,
      width: "100%",
      marginBottom: "35px",
      fontFamily: "Montserrat, sans-serif",
      textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
    },

    subTitle: {
      fontSize: "2rem",
      opacity: 0.9,
      fontFamily: "Montserrat, sans-serif",
      textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
    },

    formSection: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      color: "black",
      alignItems: "center",
    },

    container1: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "white",
      width: "100%",
      maxWidth: "500px",
      padding: "40px",
      backgroundColor: "rgba(17, 25, 40, 0.78)",
      backdropFilter: "blur(16px) saturate(200%)",
      WebkitBackdropFilter: "blur(16px) saturate(200%)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.125)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    },

    container2: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "white",
      width: "100%",
      maxWidth: "500px",
      padding: "40px",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(5px)",
      borderRadius: "20px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    },
  };
});
