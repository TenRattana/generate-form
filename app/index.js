import React, { Suspense, lazy, createContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoadingSpinner from "./components/LoadingSpinner";
import { colors, fonts, spacing } from "../theme";

import HomeScreen from "./screens/HomeScreen";
const Machine = lazy(() => import("./screens/MachineScreen"));
const QuestionScreen = lazy(() => import("./screens/QuestionScreen"));
const QuestionDetailScreen = lazy(() =>
  import("./screens/QuestionDetailScreen")
);
const ValidationScreen = lazy(() => import("./screens/ValidationScreen"));
const QuestionOptionScreen = lazy(() =>
  import("./screens/QuestionOptionScreen")
);
const ViewFormScreen = lazy(() => import("./screens/Form/ViewFormScreen"));
const Form = lazy(() => import("./screens/Form/FormScreen"));
import CreateFormScreen from "./screens/Form/CreateFormScreen";

const Drawer = createDrawerNavigator();
export const ThemeContext = createContext();

const App = () => {
  return (
    <ThemeContext.Provider value={{ colors, fonts, spacing }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Drawer.Navigator>
          <Drawer.Screen name="HomeScreen" component={HomeScreen} />
          <Drawer.Screen name="Machine" component={Machine} />
          <Drawer.Screen name="Question" component={QuestionScreen} />
          <Drawer.Screen
            name="Question Option"
            component={QuestionOptionScreen}
          />
          <Drawer.Screen
            name="Detail Question"
            component={QuestionDetailScreen}
          />
          <Drawer.Screen name="Validation" component={ValidationScreen} />
          <Drawer.Screen name="Create Form" component={CreateFormScreen} />
          <Drawer.Screen name="View Form" component={ViewFormScreen} />
          <Drawer.Screen name="Forms" component={Form} />
        </Drawer.Navigator>
      </Suspense>
    </ThemeContext.Provider>
  );
};

export default App;
