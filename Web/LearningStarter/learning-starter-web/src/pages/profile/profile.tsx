import {
  Avatar,
  Box,
  Card,
  Container,
  Group,
  Space,
  Text,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { Tabs } from "@mantine/core";
import { UserPage } from "../user-page/user-page";
import { WeightMeasure } from "./WeightMeasure";
import { useUser } from "../../authentication/use-auth";
import { Goals } from "./goals";
import {
  faUser,
  faScaleBalanced,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page

function ProfilePicture() {
  const user = useUser();
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <Group justify="center" mb="xl">
      <Avatar name={fullName} color="blue" size={100} radius="xl" />
    </Group>
  );
}
export const Profile = () => {
  return (
    <>
      <Container>
        <Space h={20} />

        <Tabs color="blue" defaultValue="profile">
          <Tabs.List grow>
            <Tabs.Tab
              value="profile"
              leftSection={<FontAwesomeIcon icon={faUser} />}
            >
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="weightMeasure"
              leftSection={<FontAwesomeIcon icon={faScaleBalanced} />}
            >
              {" "}
              Weight Log
            </Tabs.Tab>

            <Tabs.Tab
              value="goals"
              leftSection={<FontAwesomeIcon icon={faBullseye} />}
            >
              Goals
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile">
            <Space h={30} />

            <Card withBorder shadow="sm" radius="md">
              <Text fw={700} size="xlg" mb="xlg">
                User Information
              </Text>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <ProfilePicture />
              </Box>
              <UserPage />
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="weightMeasure">
            <Space h={30} />
            <Card withBorder shadow="sm" radius="md">
              <WeightMeasure />
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="goals">
            <Space h={30} />
            <Card withBorder shadow="sm" radius="md">
              <Goals />
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
};
