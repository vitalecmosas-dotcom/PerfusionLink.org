export default function SplashLogin() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <img
        src="/logo.png"
        alt="PerfusionLink"
        style={{ width: 1200 }}
      />
    </div>
  );
}