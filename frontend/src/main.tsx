import ReactDOM from "react-dom/client";
import App from "./App";
import PaymentResult from "./screens/PaymentResult";
import "./index.css";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")!).render(
  path === "/payment-result"
    ? <PaymentResult />
    : <App />
);