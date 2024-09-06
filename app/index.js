import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider, ToastProvider, ResponsiveProvider } from "./contexts";
import { Provider } from "react-redux";
import { store } from "./store";

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
console.log("app");
export default function App() {
  return (
    <Provider store={store}>
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
              {/* <Drawer.Screen name="View Form" component={ViewFormScreen} />
              <Drawer.Screen name="Forms" component={FormScreen} />
              <Drawer.Screen
                name="Match Form & Machine"
                component={MatchFormMachineScreen}
              /> */}
            </Drawer.Navigator>
          </ResponsiveProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
