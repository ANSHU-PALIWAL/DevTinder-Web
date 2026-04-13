import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Body from "./components/Body";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

// Lazy Loaded Components
const Feed = React.lazy(() => import("./components/Feed"));
const Login = React.lazy(() => import("./components/Login"));
const Profile = React.lazy(() => import("./components/Profile"));
const Requests = React.lazy(() => import("./components/Requests"));
const Settings = React.lazy(() => import("./components/Settings"));
const NotFound = React.lazy(() => import("./components/NotFound"));
const RadarView = React.lazy(() => import("./components/RadarView"));
const Connections = React.lazy(() => import("./components/Connections"));
const ProfileView = React.lazy(() => import("./components/ProfileView"));
const PublicProfile = React.lazy(() => import("./components/PublicProfile"));
const AboutUs = React.lazy(() => import("./components/AboutUs"));
const HomePage = React.lazy(() => import("./components/HomePage"));
const BlogsPage = React.lazy(() => import("./components/BlogsPage"));
const BlogDetail = React.lazy(() => import("./components/BlogDetail"));
const ContactPage = React.lazy(() => import("./components/ContactPage"));

function App() {
  return (
    <HelmetProvider>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin"></div></div>}>
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
          </Suspense>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
