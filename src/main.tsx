import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeSecurity } from "./lib/security";

// 보안 초기화
initializeSecurity();

createRoot(document.getElementById("root")!).render(<App />);
