import { Stack } from "expo-router";
import {AppProvider} from '../context/AppContext'
import CustomStatusBar from '../src/components/StatusBar';

export default function RootLayout() {
  return (
    <AppProvider>
       <CustomStatusBar />
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="AuthScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="PinScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="ResetPassword/index" options={{headerShown:false}}/>
      <Stack.Screen name="ForgetPin/index" options={{headerShown:false}}/>
      <Stack.Screen name="PatientList/index" options={{headerShown:false}}/>
      <Stack.Screen name="AddTask/index" options={{headerShown:false}}/>
      <Stack.Screen name="AddTask/medicine" options={{headerShown:false}}/>
      <Stack.Screen name="AddTask/music" options={{headerShown:false}}/>
      <Stack.Screen name="AddTask/exercise" options={{headerShown:false}}/>
      <Stack.Screen name="InPatientDetails/index" options={{headerShown:false}}/>
      

    </Stack>
    </AppProvider>
  );
}
