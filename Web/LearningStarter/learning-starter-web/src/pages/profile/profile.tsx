import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Container,
  Divider,
  FileButton,
  Group,
  Space,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { Tabs } from "@mantine/core";
//import { UserPage } from "../user-page/user-page";
import { WeightMeasure } from "./WeightMeasure";
import { useUser } from "../../authentication/use-auth";
import { Goals } from "./goals";
import {
  faUser,
  faScaleBalanced,
  faBullseye,
  faEdit,
  faSave,
  faCamera,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiResponse, UserUpdateDto } from "../../constants/types";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { notifications, showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import api from "../../config/axios";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page

function ProfilePicture() {
  const user = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
    0
  )}`.toUpperCase();
  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Here you would typically upload the file to your server
      // and update the user's profile picture in the database
      console.log("Selected file:", file);
      // uploadProfilePicture(file);
    }
  };

  return (
    <Group justify="center" pos="relative" mb="xl">
      {previewUrl ? (
        <Avatar src={previewUrl} alt={fullName} size={100} radius="xl" />
      ) : (
        <Avatar color="blue" size={100} radius="xl">
          {initials}
        </Avatar>
      )}

      <FileButton
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/gif"
      >
        {(props) => (
          <ActionIcon
            {...props}
            variant="filled"
            color="blue"
            radius="xl"
            size="sm"
            pos="absolute"
            bottom={0}
            right={0}
          >
            <FontAwesomeIcon icon={faCamera} size="xs" />
          </ActionIcon>
        )}
      </FileButton>
    </Group>
  );
}
export const Profile = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserUpdateDto>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName,
    weight: user.weight,
    height: user.height,
    updatedDate: user.updatedDate,
    dateofBirth: user.dateofBirth,
    gender: user.gender,
  });

  const updateUserProfile = async (userId: number, userData: UserUpdateDto) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }

      const data: ApiResponse<UserUpdateDto> = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUserData = {
        ...editedUser,
        updatedDate: new Date().toISOString(),
      };

      const updatedUser = await updateUserProfile(user.id, updatedUserData);

      notifications.show({
        title: "Success!",
        message: "Your profile has been updated",
        color: "teal",
        icon: <IconCheck />,
      });

      // If your useAuth hook provides an update function, you can use it here
      // For example: updateUser(updatedUser);

      setIsEditing(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
      console.error("Profile update error:", error);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      weight: user.weight,
      height: user.height,
      updatedDate: user.updatedDate,
      dateofBirth: user.dateofBirth,
      gender: user.gender,
    });
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserUpdateDto, value: string | number) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    // OR for more control over formatting:
    // return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use AM/PM
    });
  };

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
            <Card
              withBorder
              shadow="sm"
              radius="md"
              className={classes.profileCard}
            >
              <Group mb="md">
                <Text fw={700} size="xl">
                  User Information
                </Text>
                {!isEditing ? (
                  <ActionIcon
                    variant="outline"
                    color="blue"
                    onClick={handleEdit}
                    className={classes.editButton}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </ActionIcon>
                ) : (
                  <Group className={classes.editButton}>
                    <ActionIcon
                      variant="filled"
                      color="green"
                      onClick={handleSave}
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </ActionIcon>
                    <ActionIcon
                      variant="filled"
                      color="red"
                      onClick={handleCancel}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </ActionIcon>
                  </Group>
                )}
              </Group>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <ProfilePicture />
              </Box>

              <Divider my="sm" />

              <Stack>
                <Text fw={600} size="sm" color="dimmed">
                  Personal Information
                </Text>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>First Name:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      className={classes.editInput}
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.firstName}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Last Name:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className={classes.editInput}
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.lastName}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Email:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={classes.editInput}
                      type="email"
                      required
                      error={
                        !editedUser.email.includes("@") &&
                        "Please enter a valid email"
                      }
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.email}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Username:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.userName}
                      onChange={(e) => handleChange("userName", e.target.value)}
                      className={classes.editInput}
                      type="userName"
                      required
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.userName}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Date of Birth:</Text>
                  {isEditing ? (
                    <DateInput
                      value={
                        editedUser.dateofBirth
                          ? new Date(editedUser.dateofBirth)
                          : null
                      }
                      onChange={(date) =>
                        date && handleChange("dateofBirth", date.toISOString())
                      }
                      placeholder="Select date"
                      className={classes.editInput}
                      valueFormat="MMM DD, YYYY"
                    />
                  ) : (
                    <Text className={classes.infoValue}>
                      {formatDate(user.dateofBirth)}
                    </Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Height:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.height}
                      onChange={(e) => handleChange("height", e.target.value)}
                      className={classes.editInput}
                      type="height"
                      required
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.height}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Weight:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.weight}
                      onChange={(e) => handleChange("weight", e.target.value)}
                      className={classes.editInput}
                      type="weight"
                      required
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.weight}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Gender:</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedUser.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className={classes.editInput}
                      type="gender"
                      required
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user.gender}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Created Date:</Text>

                  <Text className={classes.infoValue}>
                    {formatDateTime(user.createDate)}
                  </Text>
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Updated Date:</Text>
                  <Text className={classes.infoValue}>
                    {formatDateTime(user.updatedDate)}
                  </Text>
                </div>
              </Stack>
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

const useStyles = createStyles((theme) => ({
  profileCard: {
    position: "relative",
    marginBottom: "10px"
  },
  editButton: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    // },
  },
  infoLabel: {
    fontWeight: 600,
    // color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[7],
  },
  infoValue: {
    textAlign: "right",
  },
  editInput: {
    flex: 1,
    maxWidth: "200px",
  },
}));
