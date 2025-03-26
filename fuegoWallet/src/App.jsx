import Install from "./components/Install";
import Home from "./components/Home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return;
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}

export default App;
