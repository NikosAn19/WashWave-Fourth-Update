import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";

type Step3ScheduleProps = {
  onNextStep: () => void;
  onScheduleChange: (date: string | null, time: string | null) => void;
  selectedCarWashId: string | null;
  ip: string;
};

const Step3Schedule: React.FC<Step3ScheduleProps> = ({
  onNextStep,
  onScheduleChange,
  selectedCarWashId,
  ip,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    onScheduleChange(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    if (!selectedCarWashId || !selectedDate) {
      setAvailableTimes([]);
      return;
    }

    setLoadingTimes(true);
    fetch(
      `http://${ip}:5000/api/carwashes/${selectedCarWashId}/available-times?date=${selectedDate}`
    )
      .then((res) => res.json())
      .then((data) => setAvailableTimes(data.available_times || []))
      .catch((err) => {
        console.error("Failed to load available times:", err);
        setAvailableTimes([]);
      })
      .finally(() => setLoadingTimes(false));
  }, [selectedCarWashId, selectedDate, ip]);

  const isButtonEnabled = selectedDate !== null && selectedTime !== null;

  const formatDateGreek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("el-GR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Επιλέξτε ημερομηνία</Text>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setSelectedTime(null);
        }}
        minDate={new Date().toISOString().split("T")[0]}
        markedDates={
          selectedDate
            ? { [selectedDate]: { selected: true, selectedColor: "#00ADFE" } }
            : {}
        }
        style={styles.calendar}
        theme={{
          todayTextColor: "#00ADFE",
          arrowColor: "#00ADFE",
          selectedDayBackgroundColor: "#00ADFE",
          selectedDayTextColor: "#fff",
        }}
        renderHeader={(date) => {
          const headerDate = new Date(date);
          return (
            <Text style={styles.calendarHeaderText}>
              {headerDate.toLocaleDateString("el-GR", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          );
        }}
      />

      {selectedDate && (
        <>
          <Text style={styles.selectedDateText}>
            Επιλεγμένη ημερομηνία: {formatDateGreek(selectedDate)}
          </Text>

          <View style={styles.timeContainer}>
            <Text style={styles.timeHeader}>Επιλέξτε ώρα</Text>
            <ScrollView horizontal contentContainerStyle={styles.timesList}>
              {loadingTimes ? (
                <Text>Φόρτωση...</Text>
              ) : availableTimes.length > 0 ? (
                availableTimes.map((time) => (
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
                ))
              ) : (
                <Text>Δεν υπάρχουν διαθέσιμες ώρες</Text>
              )}
            </ScrollView>
          </View>
        </>
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
    flex: 1,
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
    marginBottom: 5,
    height: 320,
  },
  calendarHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
    textTransform: "capitalize", // Κάνει κεφαλαίο το πρώτο γράμμα του μήνα
  },
  selectedDateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  timeContainer: {
    marginTop: 10,
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
