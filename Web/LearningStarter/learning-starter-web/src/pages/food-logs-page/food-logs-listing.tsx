import { Container, Space, Title } from "@mantine/core"
import { useState } from "react";
import { FoodLogGetDto } from "../../constants/types";

export const foodLogsPage = () => {
    const [foodLogs, setFoodLogs] = useState<FoodLogGetDto[]>([]);
    return (
        <Container>
            <Title order={2}>Food Logs</Title>
            <Space h="md" />
        </Container>
        
    )
}