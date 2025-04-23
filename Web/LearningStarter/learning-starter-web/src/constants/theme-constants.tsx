import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group, ActionIcon } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";

export const NAVBAR_HEIGHT_NUMBER = 60;
export const NAVBAR_HEIGHT = `${NAVBAR_HEIGHT_NUMBER}px`;

type DateNavigatorProps = {
  /** Current date shown in the picker (controlled). */
  date: Date | null;
  /** Called anytime the user moves to a new date (prev, next, manual pick). */
  onChange: (d: Date) => void;
};

export const DateNavigator = ({ date, onChange }: DateNavigatorProps) => {
  const goPrev = () => date && onChange(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
  const goNext = () => date && onChange(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));

  return (
    <Group justify="center" align="center" mb="md">
      <ActionIcon size="lg" variant="light" onClick={goPrev} color="blue">
        <FontAwesomeIcon icon={faChevronLeft} />
      </ActionIcon>

      <DateInput
        value={date}
        onChange={(d) => d && onChange(d)}
        placeholder="Select date"
        style={{ width: 293 }}
        styles={{ input: { textAlign: "center", fontWeight: 500, padding: 0 } }}
      />

      <ActionIcon size="lg" variant="light" onClick={goNext} color="blue">
        <FontAwesomeIcon icon={faChevronRight} />
      </ActionIcon>
    </Group>
  );
};