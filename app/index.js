import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider, ToastProvider, ResponsiveProvider } from "./contexts";

import {
  HomeScreen,
  MachineGroupScreen,
  MachineScreen,
  CheckListScreen,
  CheckListOptionScreen,
  GroupCheckListOptionScreen,
  MatchFormMachineScreen,
  CreateFormScreen,
  ViewFormScreen,
  FormScreen,
} from "./screens";

const Drawer = createDrawerNavigator();

export default function App() {
  console.log("App");

  return (
    <ThemeProvider>
      <ToastProvider>
        <ResponsiveProvider>
          <Drawer.Navigator
            screenOptions={{
              drawerStyle: {},
            }}
          >
            <Drawer.Screen name="HomeScreen" component={HomeScreen} />
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
            <Drawer.Screen name="Create Form" component={CreateFormScreen} />
            <Drawer.Screen name="View Form" component={ViewFormScreen} />
            <Drawer.Screen name="Forms" component={FormScreen} />
            <Drawer.Screen
              name="Match Form & Machine"
              component={MatchFormMachineScreen}
            />
          </Drawer.Navigator>
        </ResponsiveProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
