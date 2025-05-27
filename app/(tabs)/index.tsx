import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "@/components/SplashScreen";
import HomeScreen from "@/components/HomeScreen";
import { AuthProvider } from "@/context/AuthContext";
const Stack = createStackNavigator();

const App = () => {
  return (
    
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>

    
    
  );
};

export default App;
