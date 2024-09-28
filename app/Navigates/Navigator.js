import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "./AuthContext";

import {
  HomeScreen,
  MachineGroupScreen,
  MachineScreen,
  CheckListScreen,
  LoginScreen, // อย่าลืมนำเข้า LoginScreen
} from "./screens";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: 240,
        },
      }}
    >
      {user ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Machine Group" component={MachineGroupScreen} />
          <Drawer.Screen name="Machine" component={MachineScreen} />
          <Drawer.Screen name="Check List" component={CheckListScreen} />
          {/* เพิ่ม Screen อื่น ๆ ตามที่ต้องการ */}
        </>
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
