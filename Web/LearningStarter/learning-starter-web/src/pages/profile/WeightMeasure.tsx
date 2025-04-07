import { useState, useEffect } from "react";
import { Text, Button, TextInput, Loader, Table, Notification } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";

import { useAuth } from "../../authentication/use-auth"; 

interface WeightLog {
  id: number;
  userId: number;
  value: number;
  logDate: string;
}

export const WeightMeasure = () => {
  const { user } = useAuth();
  const userId = user ?.id;
  
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const form = useForm({
    initialValues: {
      weight: '',
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
      const response = await axios.get("/api/weight-logs");
      console.log('responsedata', response.data.data)
      setWeightLogs(response.data.data);
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
      console.log('Weight Log', weightLogs)
      
      await axios.post("/api/weight-logs", payload);
      setSuccess(true);
      form.reset();
      fetchWeightLogs();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating weight log:", err);
      setError("Failed to save weight data");
    }
  };
  
  if (loading) return <Loader />;
  
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Text size="xl" mb="md" fw={500}>Weight Tracking</Text>
      
      {error && (
        <Notification color="red" title="Error" onClose={() => setError(null)} mb="md">
          {error}
        </Notification>
      )}
      
      {success && (
        <Notification color="teal" title="Success" onClose={() => setSuccess(false)} mb="md">
          Weight recorded successfully!
        </Notification>
      )}
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Enter your current weight (kg)"
          placeholder="e.g. 75.5"
          type="number"
          step="0.1"
          mb="md"
          {...form.getInputProps('weight')}
        />
        <Button type="submit" color="indigo">
          Record Weight
        </Button>
      </form>
      
      <Text size="lg" mt="xl" mb="sm" fw={500}>Your Weight History</Text>
      
      {weightLogs.length === 0 ? (
        <Text color="dimmed">No weight records found</Text>
      ) : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {weightLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.logDate).toLocaleDateString()}</td>
                <td>{log.value.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}; 


