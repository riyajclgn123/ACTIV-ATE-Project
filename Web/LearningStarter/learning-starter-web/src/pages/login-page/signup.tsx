import {
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
  useMantineTheme,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React, { useState } from "react";
import { useStyles } from "../login-page/authStyles";
import { DateInput } from "@mantine/dates";


interface SignUpFormProps {
  signUpForm: UseFormReturnType<any>;
  submitSignUp: (values: any) => void;
  setIsSignUp: (val: boolean) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  signUpForm,
  submitSignUp,
  setIsSignUp,
}) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  return (
    <Card withBorder shadow="sm" className={classes.container1}>
      <form onSubmit={signUpForm.onSubmit(submitSignUp)}>
        <Space h="sm" />
        <Text
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "2vw",
            fontWeight: "bold",

            color: "white",
            marginBottom: "10px",
          }}
        >
          Create an account
        </Text>
        <Container px={0} style={{ padding: '0 5px' }}>
          {[
            { name: "firstName", label: "First Name" },
            { name: "lastName", label: "Last Name" },
            { name: "userName", label: "Username" },
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
            },
          ].map((field) => (

            <Container key={field.name} 
            className={classes.formField} 
            px={0}
            style={{ marginBottom: '4px' }}>

              <label htmlFor={field.name}>{field.label}</label>
              <Input
                type={field.type || "text"}
                placeholder={`Enter your ${field.label}`}
                {...signUpForm.getInputProps(field.name)}
              />
              <Text c="red">{signUpForm.errors[field.name]}</Text>
            </Container>
          ))}

<Container className={classes.formField} px={0} style={{ marginBottom: '4px' }}>
            <label htmlFor="dateofBirth">Date of Birth</label>
              <DateInput
                           placeholder="Select your date of birth"
                           value={signUpForm.values.dateofBirth}
                           onChange={(date) => signUpForm.setFieldValue('dateofBirth', date)}
                           maxDate={new Date()}
                           size="sm"
                        />
            <Text c="red">{signUpForm.errors["dateofBirth"]}</Text>
          </Container>

          <Container className={classes.formField} px={0}>
            <label htmlFor="gender">Gender</label>
            <Radio.Group {...signUpForm.getInputProps("gender")}>
              <Group mt="xs" >
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
              size="sm"
              styles={{
                input: {
                  padding: '8px 12px',
                  height: '36px'
                }
              }}
            />
            <Text c="red">{signUpForm.errors["height"]}</Text>
          </Container>

          <Container className={classes.formField} px={0}>
            <label htmlFor="weight">Weight (kg)</label>
            <NumberInput
              {...signUpForm.getInputProps("weight")}
              min={0}
              step={0.1}
              size="sm"
              styles={{
                input: {
                  padding: '8px 12px',
                  height: '36px'
                }
              }}
            />
            <Text c="red">{signUpForm.errors["weight"]}</Text>
          </Container>

          <Container
            px={0}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <Button
              className={classes.loginButton}
              color="blue"
                            type="submit"
                            variant="filled"
            >
              Sign Up
            </Button>
            <Button
              className={classes.loginButton}
               type="button"
               color="#b20030"
                            variant="filled"
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(false);
              }}
            >
              Back to Login
            </Button>
          </Container>

          <Space h="md" />
          <Text ta="center" size="sm">
            Already have an account?{" "}
            <Anchor
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(false);
              }}
              c="#FFD700"
            >
              Login
            </Anchor>
          </Text>
        </Container>
      </form>
    </Card>
  );
};

export default SignUpForm;
