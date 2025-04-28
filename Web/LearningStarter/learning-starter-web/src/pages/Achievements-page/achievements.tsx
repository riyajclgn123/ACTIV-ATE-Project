import { useState, useEffect } from "react";
import {
  Text,
  Button,
  Card,
  Group,
  Stack,
  Title,
  Container,
  LoadingOverlay,
  Badge,
  Divider,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import { useAuth } from "../../authentication/use-auth";
import api from "../../config/axios";
import { routes } from "../../routes";
import { IconCheck, IconTarget, IconTrophy } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: number;
  userId: number;
  type: string;
  description: string;
  createDate: string;
}

interface ApiResponse<T> {
  data: T;
  errors?: string[];
}

interface GoalStatusResponse {
  goalWeight: number;
  currentWeight: number;
  isAchieved: boolean;
  hasExistingAchievement: boolean;
  achievement?: Achievement;
}

interface AchievementsResponse extends Array<Achievement> {}

export const Achievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [goalStatus, setGoalStatus] = useState<GoalStatusResponse | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const goalResponse = await api.get<ApiResponse<GoalStatusResponse>>(
        `/api/achievements/check-weight-goal/${user?.id}`
      );
      setGoalStatus(goalResponse.data.data);

      const achievementsResponse = await api.get<
        ApiResponse<AchievementsResponse>
      >(`/api/achievements`);
      setAchievements(achievementsResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load achievement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const getProgressPercentage = () => {
    if (!goalStatus || !user?.weight) return 0;

    const initialWeight = user.weight;
    const currentWeight = goalStatus.currentWeight;
    const targetWeight = goalStatus.goalWeight;

    if (initialWeight > targetWeight) {
      return Math.min(
        100,
        ((initialWeight - currentWeight) / (initialWeight - targetWeight)) * 100
      );
    } else {
      return Math.min(
        100,
        ((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100
      );
    }
  };

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} />

      <Group justify="space-between" mb="xl">
        <Title order={2}>Your Achievements</Title>
        <Button onClick={() => navigate(routes.home)}>Back to Dashboard</Button>
      </Group>

      {error && (
        <Card mb="xl" withBorder>
          <Text color="red">{error}</Text>
        </Card>
      )}

      {goalStatus && (
        <Card withBorder shadow="sm" mb="xl" padding="lg">
          <Stack>
            <Group>
              <ThemeIcon color="blue" size="lg" radius="xl">
                <IconTarget size="1.2rem" />
              </ThemeIcon>
              <Text size="xl" fw={500}>
                Weight Goal Progress
              </Text>
              {goalStatus.isAchieved && (
                <Badge color="teal" leftSection={<IconCheck size="1rem" />}>
                  Achieved!
                </Badge>
              )}
            </Group>

            <Divider />

            <SimpleGrid cols={3}>
              <div>
                <Text size="sm" c="dimmed">
                  Starting Weight
                </Text>
                <Text size="lg">{user?.weight?.toFixed(1)} kg</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Current Weight
                </Text>
                <Text size="lg">{goalStatus.currentWeight.toFixed(1)} kg</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Target Weight
                </Text>
                <Text size="lg">{goalStatus.goalWeight.toFixed(1)} kg</Text>
              </div>
            </SimpleGrid>

            <div style={{ marginTop: "1rem" }}>
              <Text size="sm" c="dimmed" mb="xs">
                Progress: {getProgressPercentage().toFixed(0)}%
              </Text>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#f1f3f5",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: goalStatus.isAchieved
                      ? "#40c057"
                      : "#4dabf7",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {goalStatus.isAchieved && goalStatus.achievement && (
              <Card withBorder mt="sm" style={{ backgroundColor: "#f8f9fa" }}>
                <Group>
                  <ThemeIcon color="yellow" size="lg" radius="xl">
                    <IconTrophy size="1.2rem" />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>{goalStatus.achievement.description}</Text>
                    <Text size="sm" c="dimmed">
                      Achieved on{" "}
                      {new Date(
                        goalStatus.achievement.createDate
                      ).toLocaleDateString()}
                    </Text>
                  </div>
                </Group>
              </Card>
            )}
          </Stack>
        </Card>
      )}

      <Card withBorder shadow="sm" padding="lg">
        <Stack>
          <Group>
            <ThemeIcon color="yellow" size="lg" radius="xl">
              <IconTrophy size="1.2rem" />
            </ThemeIcon>
            <Text size="xl" fw={500}>
              Your Achievement Collection
            </Text>
          </Group>

          <Divider />

          {achievements.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No achievements yet. Keep working toward your goals!
            </Text>
          ) : (
            <SimpleGrid cols={1} spacing="sm">
              {achievements.map((achievement) => (
                <Card key={achievement.id} withBorder>
                  <Group>
                    <ThemeIcon color="yellow" size="md" radius="xl">
                      <IconTrophy size="1rem" />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>{achievement.description}</Text>
                      <Text size="sm" c="dimmed">
                        Earned on{" "}
                        {new Date(achievement.createDate).toLocaleDateString()}
                      </Text>
                    </div>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Card>
    </Container>
  );
};
