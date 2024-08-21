import React, { Suspense, lazy } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoadingSpinner from "./components/LoadingSpinner";

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
const QuestionValidationScreen = lazy(() =>
  import("./screens/QuestionValidationScreen")
);
const ViewFormScreen = lazy(() => import("./screens/Form/ViewFormScreen"));
import CreateFormScreen from "./screens/Form/CreateFormScreen";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
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
        <Drawer.Screen
          name="Match Validation"
          component={QuestionValidationScreen}
        />
        <Drawer.Screen name="Create Form" component={CreateFormScreen} />
        <Drawer.Screen name="View Form" component={ViewFormScreen} />
      </Drawer.Navigator>
    </Suspense>
  );
};

export default App;
