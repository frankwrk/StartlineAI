import { Switch, Route } from "wouter";
import TerminalLayout from "./components/TerminalLayout";
import HomePage from "./pages/HomePage";
import IdeaValidation from "./pages/IdeaValidation";
import BusinessPlan from "./pages/BusinessPlan";
import ResourcePlanning from "./pages/ResourcePlanning";
import MvpGuidance from "./pages/MvpGuidance";

function App() {
  return (
    <TerminalLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/idea-validation" component={IdeaValidation} />
        <Route path="/business-plan" component={BusinessPlan} />
        <Route path="/resource-planning" component={ResourcePlanning} />
        <Route path="/mvp-guidance" component={MvpGuidance} />
        <Route>404: Command not found</Route>
      </Switch>
    </TerminalLayout>
  );
}

export default App;
