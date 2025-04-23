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
  Select,
  SegmentedControl,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { ApiResponse, WeightLogGetDto } from "../../constants/types";
import api from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LineChart } from "@mantine/charts";
import "@mantine/charts/styles.css";

export const WeightMeasure = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { classes } = useStyles();
  const [weightLogs, setWeightLogs] = useState<WeightLogGetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editingLog, setEditingLog] = useState<WeightLogGetDto | null>(null);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [inputUnit, setInputUnit] = useState<'kg' | 'lb'>('kg');

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
    if (!userId) return;
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<WeightLogGetDto[]>>(`/api/weight-logs/${userId}`);
      setWeightLogs(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching weight logs:", err);
      setError("Failed to load weight data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeightLogs();
  }, [userId]);

  const handleSubmit = async (values: { weight: string }) => {
    if (!userId) return setError("User not authenticated");

    try {
      let weightInKg = parseFloat(values.weight);
      if (inputUnit === 'lb') {
        weightInKg = weightInKg / 2.20462;
      }

      const payload = {
        userId: userId,
        value: weightInKg,
        logDate: new Date().toISOString(),
      };

      if (editingLog) {
        await api.put<ApiResponse<WeightLogGetDto>>(`/api/weight-logs/${editingLog.id}`, payload);
      } else {
        await api.post<ApiResponse<WeightLogGetDto>>("/api/weight-logs", payload);
      }

      setSuccess(true);
      form.reset();
      fetchWeightLogs();
      setEditingLog(null);
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

  const convertWeight = (kg: number) => {
    return unit === 'kg'
      ? `${kg.toFixed(1)} kg`
      : `${(kg * 2.20462).toFixed(1)} lb`;
  };

  const chartData = weightLogs.map(log => ({
    date: new Date(log.logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Weight: unit === 'kg' ? log.value : log.value * 2.20462,
  }));

  if (loading) return <Loader />;

  return (
    <Box style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <Text size="xl" mb="md" fw={500}>Weight Tracking</Text>

      {error && (
        <Notification color="red" title="Error" onClose={() => setError(null)} mb="md">
          {error}
        </Notification>
      )}

      {success && (
        <Notification color="teal" title="Success" onClose={() => setSuccess(false)} mb="md">
          Weight {editingLog ? 'updated' : 'recorded'} successfully!
        </Notification>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)} style={{ marginBottom: '2rem' }}>
        <Box style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <TextInput
            label="Weight"
            placeholder="e.g. 75.5"
            type="number"
            step="0.1"
            required
            {...form.getInputProps("weight")}
          />
          <Select
            label="Unit"
            value={inputUnit}
            onChange={(value) => {
              const selected = value as 'kg' | 'lb';
              setInputUnit(selected);
              setUnit(selected);
            }}
            data={[
              { label: 'Kilograms (kg)', value: 'kg' },
              { label: 'Pounds (lb)', value: 'lb' },
            ]}
            required
          />
        </Box>
        <Button type="submit" color="indigo" mt="md">
          {editingLog ? "Update Weight" : "Record Weight"}
        </Button>
      </form>

      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Text size="lg" fw={500}>Your Weight History</Text>
        <SegmentedControl
          value={unit}
          onChange={(value) => setUnit(value as 'kg' | 'lb')}
          data={[
            { label: 'Kilograms', value: 'kg' },
            { label: 'Pounds', value: 'lb' },
          ]}
        />
      </Box>

      {weightLogs.length === 0 ? (
        <Text color="dimmed">No weight records found</Text>
      ) : (
        <>
          <div className={classes.table}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Weight</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {weightLogs.map((log) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>{new Date(log.logDate).toLocaleDateString()}</Table.Td>
                    <Table.Td>{convertWeight(log.value)}</Table.Td>
                    <Table.Td>
                      <Group style={{ display: "flex", gap: "6px" }}>
                        <Button size="xs" color="blue" onClick={() => handleEdit(log)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button size="xs" color="red" variant="outline" onClick={() => handleDelete(log.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          <Box mt="xl">
            <Text fw={500} mb="sm">Weight Progress Chart</Text>
            <LineChart
              h={300}
              data={chartData}
              dataKey="date"
              unit={unit}
              withLegend={false}
              curveType="monotone"
              series={[{ name: "Weight", color: "blue" }]}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const useStyles = createStyles(() => ({
  table: {
    margin: "20px 0",
    padding: "10px",
  },
}));
