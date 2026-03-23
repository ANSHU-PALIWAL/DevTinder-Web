import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Profile from "./components/Profile";
import Requests from "./components/Requests";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import RadarView from "./components/RadarView";
import Connections from "./components/Connections";
import ProfileView from "./components/ProfileView";
import PublicProfile from "./components/PublicProfile";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/radar" element={<RadarView />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/profile/edit" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/match/profile" element={<PublicProfile />} />
              <Route path="/about" element={<AboutUs />} />

              {/* Catch-All Route: Must be the very last route! */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
