import logo from './logo.svg';
import Stream from './pages/Stream.jsx';
import StreamList from './pages/StreamList.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoFlow from './pages/VideoFlow.jsx';
import { ThemeProvider } from "styled-components";
import './App.css';
import theme from "./constants/theme.js"
import {useState} from 'react';
import OnboardingScreen from './screens/OnboardingScreen.jsx'
import OnboardingSettingsScreen from './screens/OnboardingSettingsScreen.jsx';
import Orchestra from "./components/controls/Orchestra.jsx"
import Venue from "./components/controls/Venue.jsx"
// import SelectLocationScreen from "./screens/SelectLocationScreen.jsx";
import ErrorScreen from './screens/ErrorScreen.jsx';
import SixDOF from './pages/SixDOF.jsx';
import { Provider } from "react-redux"
import store from "./store/store.js"

function App() {
  const [selectedStreaming, setSelectedStreaming] = useState(null);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Home Page - List of Streams */}
            <Route path="/" element={<StreamList setSelectedStreaming={setSelectedStreaming} />} />
            <Route path="/streaming/:id" element={<Stream />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/onboarding-settings" element={<OnboardingSettingsScreen />} />
            <Route path="/error" element={<ErrorScreen />} />
            <Route path="/orchestra/:id/edit" element={<Orchestra imageUrl="https://www.risingsoftware.com/uploads/media/orchestra_layout-1722582810.png" editable={true} />} />
            <Route path="/venue/:id/edit" element={<Venue imageUrl="/assets/venuelayout.png" editable={true}/>} />
            <Route path="*" element={<p>404 - Page Not Found</p>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;