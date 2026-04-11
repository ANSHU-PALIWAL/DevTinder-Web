import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import HomePage from "./components/HomePage";
import BlogsPage from "./components/BlogsPage";
import BlogDetail from "./components/BlogDetail";
import ContactPage from "./components/ContactPage";

function App() {
  return (
    <HelmetProvider>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              {/* ── Protected / App Routes ── */}
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/radar" element={<RadarView />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/profile/edit" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/match/profile" element={<PublicProfile />} />

              {/* ── Public Marketing Routes ── */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Catch-All Route: Must be the very last route! */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
