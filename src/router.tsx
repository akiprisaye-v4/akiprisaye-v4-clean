import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Comparateur from "./pages/Comparateur";
import Carte from "./pages/Carte";
import ScanOCR from "./pages/ScanOCR";
import ListeCourses from "./pages/ListeCourses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* 🔴 MARQUEUR VISUEL DE TEST */}
        <div
          style={{
            background: "red",
            color: "white",
            padding: "12px",
            fontWeight: "bold",
            textAlign: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
          }}
        >
          ROUTER ACTIF – HOME CONNECTÉ – 31/12/2025
        </div>

        <div style={{ paddingTop: "60px" }}>
          <Home />
        </div>
      </>
    ),
  },

  {
    path: "/comparateur",
    element: <Comparateur />,
  },
  {
    path: "/carte",
    element: <Carte />,
  },
  {
    path: "/scanner",
    element: <ScanOCR />,
  },
  {
    path: "/liste-courses",
    element: <ListeCourses />,
  },
]);