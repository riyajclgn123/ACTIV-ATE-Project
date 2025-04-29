import { Container, Divider, Flex, Group, Text } from "@mantine/core";
import { useUser } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { Button } from "@mantine/core";

export const UserPage = () => {
  const user = useUser();
  const { classes } = useStyles();

  return (
    <Container>
      <Container>
        <Group justify="center" mb="xl">
          <Text size="xl" fw={500}>
            {user.firstName} {user.lastName}
          </Text>
        </Group>

        <Container className={classes.textAlignLeft}>
          <Flex direction="row" align="center" mb="sm">
            <Text size="md" className={classes.labelText}>
              Email:
            </Text>
            <Text size="md">{user.email}</Text>
            <Button variant="transparent" color="orange" size="xs" radius="xs">
              Edit
            </Button>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Username:
            </Text>
            <Text size="md">{user.userName}</Text>
            <Button variant="transparent" color="orange" size="xs" radius="xs">
              Edit
            </Button>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Weight:
            </Text>
            <Text size="md">{user.weight}</Text>
            <Button variant="transparent" color="orange" size="xs" radius="xs">
              Edit
            </Button>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Height:
            </Text>
            <Text size="md">{user.height}</Text>
            <Button variant="transparent" color="orange" size="xs" radius="xs">
              Edit
            </Button>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Date of Birth:
            </Text>
            <Text size="md">{user.dateofBirth}</Text>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Gender:
            </Text>
            <Text size="md">{user.gender}</Text>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Created At:
            </Text>
            <Text size="md">{user.createDate}</Text>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Updated At:
            </Text>
            <Text size="md">{user.updatedDate}</Text>
          </Flex>
          <Divider />
        </Container>
      </Container>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    textAlignLeft: {
      textAlign: "left",
    },

    labelText: {
      marginRight: "10px",
    },

    userPageContainer: {
      display: "flex",
      justifyContent: "center",
    },
  };
});
