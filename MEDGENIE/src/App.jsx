import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Robot36Demo from "./pages/core/Robot36";
// ---------------- LANDING PAGE ----------------
import Landing from "./pages/core/Landing";

// ---------------- NAVBARS ----------------
import NavbarCore from "./components/navbars/NavbarCore";
import NavbarForecast from "./components/navbars/NavbarForecast";
import NavbarAutomation from "./components/navbars/NavbarAutomation";

// ---------------- CORE PAGES ----------------
import Dashboard from "./pages/core/Dashboard";
import ChatBot from "./pages/core/ChatBot";
import Upload from "./pages/core/Upload";
import VideoAI from "./pages/core/VideoAI";
import TelemedicineRoom from "./pages/core/TelemedicineRoom";  // <-- NEW

// ---------------- CLIMATE PAGES ----------------
import Forecast from "./pages/climate/Forecast";
import CropAI from "./pages/climate/CropAI";
import Outbreak from "./pages/climate/Outbreak";
import IMDLive from "./pages/climate/IMDLive";
import Maps from "./pages/climate/Maps";

// ---------------- AUTOMATION PAGES ----------------
import Alerts from "./pages/automation/Alerts";
import Webhooks from "./pages/automation/Webhooks";
import Training from "./pages/automation/Training";
import Analytics from "./pages/automation/Analytics";


// ------------------------------------------------------
// AUTO NAVBAR LOGIC — CLEAN & FIXED
// ------------------------------------------------------
function Layout({ children }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const climateRoutes = ["/forecast", "/crop", "/outbreak", "/imd", "/maps"];
  const automationRoutes = ["/alerts", "/webhooks", "/training", "/analytics"];

  const isClimate = climateRoutes.some((r) => path.startsWith(r));
  const isAutomation = automationRoutes.some((r) => path.startsWith(r));

  // Landing Page (hide nav)
  const isLanding = path === "/";

  // Core pages = everything else
  const isCore = !isClimate && !isAutomation && !isLanding;

  return (
    <>
      {!isLanding && isCore && <NavbarCore />}
      {!isLanding && isClimate && <NavbarForecast />}
      {!isLanding && isAutomation && <NavbarAutomation />}

      {/* Add spacing only when navbar is visible */}
      <div className={!isLanding ? "pt-20" : ""}>
        {children}
      </div>
    </>
  );
}


// ------------------------------------------------------
// MAIN ROUTER
// ------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* ---------- LANDING ---------- */}
          <Route path="/" element={<Landing />} />

          {/* ---------- CORE ROUTES ---------- */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/video" element={<VideoAI />} />
          <Route path="/telemedicine" element={<TelemedicineRoom />} />   {/* NEW */}

          {/* ---------- CLIMATE ROUTES ---------- */}
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/crop" element={<CropAI />} />
          <Route path="/outbreak" element={<Outbreak />} />
          <Route path="/imd" element={<IMDLive />} />
          <Route path="/maps" element={<Maps />} />

          {/* ---------- AUTOMATION ROUTES ---------- */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/webhooks" element={<Webhooks />} />
          <Route path="/training" element={<Training />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/robot36" element={<Robot36Demo />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
