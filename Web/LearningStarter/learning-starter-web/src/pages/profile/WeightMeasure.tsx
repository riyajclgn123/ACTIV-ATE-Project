import { useState, useEffect } from "react";
import {
  Text,
  Button,
  TextInput,
  Loader,
  Table,
  Notification,
  Group,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { ApiResponse, WeightLogGetDto } from "../../constants/types";
import api from "../../config/axios";

interface WeightLog {
  id: number;
  userId: number;
  value: number;
  logDate: string;
}

export const WeightMeasure = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { classes } = useStyles();
  const [weightLogs, setWeightLogs] = useState<WeightLogGetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editingLog, setEditingLog] = useState<WeightLogGetDto | null>(null);

  const form = useForm({
    initialValues: {
      weight: "",
    },
    validate: {
      weight: (value) => {
        const num = parseFloat(value);
        return isNaN(num) || num <= 0
          ? 'Please enter a valid weight (greater than 0)'
          : null;
      },
    },
  });

  const fetchWeightLogs = async () => {
    if (!userId) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get<ApiResponse<WeightLogGetDto[]>>(`/api/weight-logs/${userId}`);
      const data = response.data.data;
      if (data === null || data === undefined) {
        setWeightLogs([]);
      } else {
        setWeightLogs(data);
      }
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching weight logs:", err);
      setError("Failed to load weight data: ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWeightLogs();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleSubmit = async (values: { weight: string }) => {
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    try {
      const payload = {
        userId: userId,
        value: parseFloat(values.weight),
        logDate: new Date().toISOString(),
      };

      await api.post<ApiResponse<WeightLogGetDto>>("/api/weight-logs", payload);
      setSuccess(true);
      form.reset();
      fetchWeightLogs();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving weight log:", err);
      setError("Failed to save weight data");
    }
  };

  const handleEdit = (log: WeightLogGetDto) => {
    form.setValues({ weight: log.value.toString() });
    setEditingLog(log);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/weight-logs/${id}`);
      fetchWeightLogs();
    } catch (err) {
      console.error("Error deleting weight log:", err);
      setError("Failed to delete weight data");
    }
  };

  if (loading) return <Loader />;

  return (
    <Box style={{ maxWidth: 800, margin: '0', padding: '1rem' }}>
      <Text size="xl" mb="md" fw={500}>Weight Tracking</Text>

      {error && (
        <Notification
          color="red"
          title="Error"
          onClose={() => setError(null)}
          mb="md"
        >
          {error}
        </Notification>
      )}

      {success && (
        <Notification color="teal" title="Success" onClose={() => setSuccess(false)} mb="md">
          Weight {editingLog ? 'updated' : 'recorded'} successfully!
        </Notification>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)} style={{ marginBottom: '2rem' }}>
        <TextInput
          label="Enter your current weight (kg)"
          placeholder="e.g. 75.5"
          type="number"
          step="0.1"
          mb="md"
          {...form.getInputProps("weight")}
        />
        <Button type="submit" color="indigo">
          {editingLog ? "Update Weight" : "Record Weight"}
        </Button>
      </form>

      <Text size="lg" mt="xl" mb="sm" fw={500}>Your Weight History</Text>

      {weightLogs.length === 0 ? (
        <Text color="dimmed">No weight records found</Text>
      ) : (
        <div className={classes.table}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Weight (kg)</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {weightLogs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>{new Date(log.logDate).toLocaleDateString()}</Table.Td>
                  <Table.Td>{log.value.toFixed(1)}</Table.Td>
                  <Table.Td>
                    <Group style={{ display: "flex", gap: "6px" }}>
                      <Button size="xs" color="blue" onClick={() => handleEdit(log)}>Edit</Button>
                      <Button size="xs" color="red" variant="outline" onClick={() => handleDelete(log.id)}>Delete</Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </Box>
  );
};

const useStyles = createStyles(() => {
  return {
    table: {
      margin: "20px 0",
      padding: "10px",
    }
  }
});
