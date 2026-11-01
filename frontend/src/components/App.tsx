import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { MotionConfig } from "framer-motion";
import Todos from "./Todos";
import { theme } from "../theme";

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      {/* Honour the OS "reduce motion" setting for every animation in the app */}
      <MotionConfig reducedMotion="user">
        <Router>
          <Routes>
            <Route path="/" element={<Todos />} />
            {/* the old /new page is now the composer on the main page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </MotionConfig>
    </ChakraProvider>
  );
};

export default App;
