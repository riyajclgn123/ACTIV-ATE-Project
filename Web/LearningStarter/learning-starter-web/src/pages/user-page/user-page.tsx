import { Container, Divider, Flex, Text } from "@mantine/core";
import { useUser } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";

export const UserPage = () => {
  const user = useUser();
  const { classes } = useStyles();


  return (
    <Container>
      <Container>
        <Text size="lg" ta="center">
          User Information
        </Text>
        <Container className={classes.textAlignLeft}>
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              First Name:
            </Text>
            <Text size="md">{user.firstName}</Text>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Last Name:
            </Text>
            <Text size="md">{user.lastName}</Text>
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Email:
            </Text>
            <Text size="md">{user.email}</Text>
          </Flex> 
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Username:
            </Text>
            <Text size="md">{user.userName}</Text>  
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Weight:
            </Text>
            <Text size="md">{user.weight}</Text> 
          </Flex>
          <Divider />
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Height:
            </Text>
            <Text size="md">{user.height}</Text>
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
