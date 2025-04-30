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
      videoRef.current.play().catch(error => {
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
      <Container>
        <Container px={0}>
          {!isSignUp ? (
            <>
              {loginForm.errors[""] && (
                <Alert className={classes.generalErrors} color="red">
                  <Text>{loginForm.errors[""]}</Text>
                </Alert>
              )}

              <Space h="lg" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight:"90vh",
                  width:"100%"
                }}
              >
                <Card
                  withBorder
                  shadow="sm"
                  style={{ width: "600px", padding: "20px" }}
                  className={classes.container1}
                >
                  <form onSubmit={loginForm.onSubmit(submitLogin)}>
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontFamily: "serif",
                        fontSize: "30px",
                        fontWeight: "bold",
                        textUnderlineOffset: "5px",
                        textDecoration: "underline",
                        textDecorationThickness: "2px",
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
                        <Button className={classes.loginButton} type="submit">
                          Login
                        </Button>
                        <Button
                          className={classes.loginButton}
                          type="button"
                          variant="outline"
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
              </div>
            </>
          ) : (
            <>
              {signUpForm.errors[""] && (
                <Alert className={classes.generalErrors} color="red">
                  <Text>{signUpForm.errors[""]}</Text>
                </Alert>
              )}
              <Space h="lg" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card
                  withBorder
                  shadow="sm"
                  style={{ width: "600px", padding: "20px" }}
                  className={classes.container2}
                >
                  <form onSubmit={signUpForm.onSubmit(submitSignUp)}>
                    <Space h="lg" />
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontFamily: "serif",
                        fontSize: "30px",
                        fontWeight: "bold",
                        textUnderlineOffset: "5px",
                        textDecoration: "underline",
                        textDecorationThickness: "2px",
                        color: "white",
                        marginBottom: "20px",
                      }}
                    >
                      Create A New Account
                    </Text>
                    <Container px={0}>
                      <Container className={classes.formField} px={0}>
                        <label htmlFor="firstName">First Name</label>
                        <Input
                          placeholder="Enter your First Name"
                          {...signUpForm.getInputProps("firstName")}
                        />
                        <Text c="red">{signUpForm.errors["firstName"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="lastName">Last Name</label>
                        <Input
                          placeholder="Enter your Last Name"
                          {...signUpForm.getInputProps("lastName")}
                        />
                        <Text c="red">{signUpForm.errors["lastName"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="userName">Username</label>
                        <Input
                          placeholder="Enter your Username"
                          {...signUpForm.getInputProps("userName")}
                        />
                        <Text c="red">{signUpForm.errors["userName"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="email">Email</label>
                        <Input
                          type="email"
                          placeholder="Ente your Email"
                          {...signUpForm.getInputProps("email")}
                        />
                        <Text c="red">{signUpForm.errors["email"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="dateofBirth">
                          Date of Birth (YYYY-MM-DD)
                        </label>
                        <Input
                          placeholder="YYYY-MM-DD"
                          {...signUpForm.getInputProps("dateofBirth")}
                        />
                        <Text c="red">{signUpForm.errors["dateofBirth"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="gender">Gender</label>
                        <Radio.Group {...signUpForm.getInputProps("gender")}>
                          <Group mt="xs">
                            <Radio value="male" label="Male" />
                            <Radio value="female" label="Female" />
                            <Radio value="other" label="Other" />
                          </Group>
                        </Radio.Group>
                        <Text c="red">{signUpForm.errors["gender"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="height">Height (cm)</label>
                        <NumberInput
                          {...signUpForm.getInputProps("height")}
                          min={0}
                          step={1}
                        />
                        <Text c="red">{signUpForm.errors["height"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="weight">Weight (kg)</label>
                        <NumberInput
                          {...signUpForm.getInputProps("weight")}
                          min={0}
                          step={0.1}
                        />
                        <Text c="red">{signUpForm.errors["weight"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="password">Password</label>
                        <Input
                          type="password"
                          placeholder="Enter your Password"
                          {...signUpForm.getInputProps("password")}
                        />
                        <Text c="red">{signUpForm.errors["password"]}</Text>
                      </Container>

                      <Container className={classes.formField} px={0}>
                        <label htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Confirm your Password"
                          {...signUpForm.getInputProps("confirmPassword")}
                        />
                        <Text c="red">
                          {signUpForm.errors["confirmPassword"]}
                        </Text>
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
                        <Button className={classes.loginButton} type="submit">
                          Sign Up
                        </Button>
                        <Button
                          className={classes.loginButton}
                          variant="outline"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsSignUp(false);
                          }}
                        >
                          Back to Login
                        </Button>
                      </Container>

                      <Space h="md" />
                      <Text ta="center">
                        Already have an account?{" "}
                        <Anchor
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsSignUp(false);
                          }}
                        >
                          Login
                        </Anchor>
                      </Text>
                    </Container>
                  </form>
                </Card>
              </div>
            </>
          )}
        </Container>
      </Container>
    </PageWrapper>
  );
};

const useStyles = createStyles(() => {
  return {
    videoContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
    },
    videoBackground: {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      //opacity: 0.8,
    },
    generalErrors: {
      marginBottom: "8px",
    },

    loginButton: {
      marginTop: "8px",
    },

    formField: {
      marginBottom: "8px",
    },
    container1: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "white",
      width: "100%",
      height: "100%",
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      overflow: "hidden",
    },
    container2: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "white",
      width: "100%",
      height: "100%",
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      overflow: "hidden",
      marginBottom: "10px"
    },
  };
});
