import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";

type Step3ScheduleProps = {
  onNextStep: () => void;
  onScheduleChange: (date: string | null, time: string | null) => void;
};

const Step3Schedule: React.FC<Step3ScheduleProps> = ({ onNextStep, onScheduleChange }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Δημιουργία λίστας διαθέσιμων ωρών (από 8:00 έως 15:30, ανά 30 λεπτά)
  const generateTimes = (): string[] => {
    const times: string[] = [];
    let hour = 8;
    let minute = 0;
    while (hour < 15 || (hour === 15 && minute <= 30)) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(timeStr);
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }
    return times;
  };

  const availableTimes = generateTimes();

  useEffect(() => {
    onScheduleChange(selectedDate, selectedTime);
  },[selectedDate, selectedTime])

  // Το κουμπί είναι enabled μόνο αν έχουν επιλεγεί ημερομηνία και ώρα
  const isButtonEnabled = selectedDate !== null && selectedTime !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Επιλέξτε ημερομηνία</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        minDate={new Date().toISOString().split("T")[0]}
        markedDates={
          selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#00ADFE" } } : {}
        }
        style={styles.calendar}
      />
      {selectedDate && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeHeader}>Επιλέξτε ώρα</Text>
          <ScrollView horizontal contentContainerStyle={styles.timesList}>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  selectedTime === time && styles.activeTimeCard,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.activeTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <TouchableOpacity
        style={[styles.nextButton, !isButtonEnabled && styles.disabledButton]}
        onPress={onNextStep}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.nextButtonText}>Επιλογή</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
  },
  timeContainer: {
    marginTop: 20,
  },
  timeHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  timesList: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  timeCard: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  activeTimeCard: {
    backgroundColor: "#00ADFE",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  activeTimeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#00ADFE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Step3Schedule;
