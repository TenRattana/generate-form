import React, { Suspense, lazy } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoadingSpinner from "./components/LoadingSpinner";
import { ThemeProvider, ToastProvider } from "./contexts";

const HomeScreen = lazy(() => import("./screens/HomeScreen"));
const Machine = lazy(() => import("./screens/MachineScreen"));
const ListScreen = lazy(() => import("./screens/ListScreen"));
const ListDetailScreen = lazy(() => import("./screens/ListDetailScreen"));
const MatchListDetailScreen = lazy(() =>
  import("./screens/MatchListDetailScreen")
);

const ViewFormScreen = lazy(() => import("./screens/Form/ViewFormScreen"));
const Form = lazy(() => import("./screens/Form/FormScreen"));
const CreateFormScreen = lazy(() => import("./screens/Form/CreateFormScreen"));
const MatchFormMachineScreen = lazy(() => import("./screens/MatchFormMachineScreen"));

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Drawer.Navigator>
            <Drawer.Screen name="HomeScreen" component={HomeScreen} />
            <Drawer.Screen name="Machine" component={Machine} />
            <Drawer.Screen name="List" component={ListScreen} />
            <Drawer.Screen name="List Detail" component={ListDetailScreen} />
            <Drawer.Screen
              name="Match List & List Detail"
              component={MatchListDetailScreen}
            />
            <Drawer.Screen name="Create Form" component={CreateFormScreen} />
            <Drawer.Screen name="View Form" component={ViewFormScreen} />
            <Drawer.Screen name="Forms" component={Form} />
            <Drawer.Screen name="Match Form & Machine" component={MatchFormMachineScreen} />
          </Drawer.Navigator>
        </Suspense>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
