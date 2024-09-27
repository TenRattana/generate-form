import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider, ToastProvider, ResponsiveProvider } from "../contexts";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../store";

import {
  HomeScreen,
  MachineGroupScreen,
  MachineScreen,
  CheckListScreen,
  CheckListOptionScreen,
  GroupCheckListOptionScreen,
  MatchCheckListOptionScreen,
  MatchFormMachineScreen,
  CreateFormScreen,
  ViewFormScreen,
  FormScreen,
  TestComponent,
  GenerateQR,
  CameraScan,
  ExpectedResultScreen,
} from "./screens";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <ResponsiveProvider>
            <PaperProvider>
              <Drawer.Navigator
                screenOptions={{
                  drawerStyle: {
                    width: 240,
                  },
                }}
              >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen
                  name="Machine Group"
                  component={MachineGroupScreen}
                />
                <Drawer.Screen name="Machine" component={MachineScreen} />
                <Drawer.Screen name="Check List" component={CheckListScreen} />
                <Drawer.Screen
                  name="Check List Option"
                  component={CheckListOptionScreen}
                />
                <Drawer.Screen
                  name="Group Check List Option"
                  component={GroupCheckListOptionScreen}
                />
                <Drawer.Screen
                  name="Match Check List Option"
                  component={MatchCheckListOptionScreen}
                />
                <Drawer.Screen
                  name="Create Form"
                  component={CreateFormScreen}
                />
                <Drawer.Screen name="View Form" component={ViewFormScreen} />
                <Drawer.Screen name="Forms" component={FormScreen} />
                <Drawer.Screen
                  name="Match Form & Machine"
                  component={MatchFormMachineScreen}
                />
                <Drawer.Screen name="Result" component={ExpectedResultScreen} />
                <Drawer.Screen name="Test" component={TestComponent} />
                <Drawer.Screen name="Generate QR Code" component={GenerateQR} />
                <Drawer.Screen name="Scan QR Code" component={CameraScan} />
              </Drawer.Navigator>
            </PaperProvider>
          </ResponsiveProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
