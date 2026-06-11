import { useEffect, useState } from "react";
import SplashLogin from "./screens/SplashLogin";
import Login from "./components/Login";
import Home from "./screens/Home";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [role, setRole] = useState<string>("user");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // 1️⃣ Splash
  if (showSplash) {
    return <SplashLogin />;
  }

  // 2️⃣ Login (si no hay usuario o UID)
  if (!user || !uid) {
    return (
      <Login
        onLogin={(username: string, userRole: string, userUid: string) => {
          console.log("LOGIN UID:", userUid); // 🔍 debug útil

          setUser(username);
          setRole(userRole);
          setUid(userUid);
        }}
      />
    );
  }

  // 3️⃣ Home
  return (
    <Home
      user={user}
      role={role}
      uid={uid}
      onLogout={() => {
        setUser(null);
        setRole("user");
        setUid(null);
      }}
    />
  );
}