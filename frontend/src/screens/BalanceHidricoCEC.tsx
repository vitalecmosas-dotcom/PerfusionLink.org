import {
  Droplet,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

/* ================= PROPS ================= */

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

/* ================= COMPONENTE ================= */

export default function BalanceHidricoCEC({
  datos,
  setDatos,
}: Props) {
  const balance = datos.intraCEC.balanceHidrico;

  const [openIngresos, setOpenIngresos] = useState(true);
  const [openEgresos, setOpenEgresos] = useState(false);

  const [openCristaloides, setOpenCristaloides] = useState(false);
  const [openColoides, setOpenColoides] = useState(false);
  const [openMedicamentos, setOpenMedicamentos] = useState(false);
  const [openHemoderivados, setOpenHemoderivados] = useState(false);

  const updateBalance = <
    K extends keyof DatosClinicos["intraCEC"]["balanceHidrico"]
  >(
    field: K,
    value: DatosClinicos["intraCEC"]["balanceHidrico"][K]
  ) => {
    setDatos((prev) => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        balanceHidrico: {
          ...prev.intraCEC.balanceHidrico,
          [field]: value,
        },
      },
    }));
  };

  /* ===== SUMAS ===== */

  const sum = (obj: Record<string, string>) =>
    Object.values(obj).reduce(
      (acc, v) => acc + (parseFloat(v) || 0),
      0
    );

  const totalIngresos = useMemo(
    () =>
      sum(balance.ingresos) +
      sum(balance.cristaloides) +
      sum(balance.coloides) +
      sum(balance.medicamentos) +
      sum(balance.hemoderivados),
    [balance]
  );

  const totalEgresos = useMemo(
    () => sum(balance.egresos),
    [balance.egresos]
  );

  const balanceIntraCEC = useMemo(
    () => totalIngresos - totalEgresos,
    [totalIngresos, totalEgresos]
  );

  return (
    <div style={card}>
      <div style={header}>
        <Droplet size={20} />
        Balance Hídrico
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#1e293b" }} />

      <div style={grid}>
        {/* INGRESOS */}
        <div style={{ ...subCard, borderColor: "#22c55e40" }}>
          <div
            style={{ ...subHeader, color: "#22c55e", cursor: "pointer" }}
            onClick={() => setOpenIngresos(!openIngresos)}
          >
            <ArrowDownCircle size={18} />
            INGRESOS
            <span style={{ marginLeft: "auto", fontSize: 13 }}>
              {totalIngresos} ml
            </span>
            {openIngresos ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>

          {openIngresos && (
            <div style={ingresosList}>
              <Section
                title="CRISTALOIDES"
                open={openCristaloides}
                toggle={() =>
                  setOpenCristaloides(!openCristaloides)
                }
                data={balance.cristaloides}
                setData={(v) =>
                  updateBalance("cristaloides", v)
                }
              />

              <Section
                title="COLOIDES"
                open={openColoides}
                toggle={() =>
                  setOpenColoides(!openColoides)
                }
                data={balance.coloides}
                setData={(v) =>
                  updateBalance("coloides", v)
                }
              />

              <Section
                title="MEDICAMENTOS"
                open={openMedicamentos}
                toggle={() =>
                  setOpenMedicamentos(!openMedicamentos)
                }
                data={balance.medicamentos}
                setData={(v) =>
                  updateBalance("medicamentos", v)
                }
              />

              <Section
                title="HEMODERIVADOS"
                open={openHemoderivados}
                toggle={() =>
                  setOpenHemoderivados(!openHemoderivados)
                }
                data={balance.hemoderivados}
                setData={(v) =>
                  updateBalance("hemoderivados", v)
                }
              />

              {Object.keys(balance.ingresos).map((item) => (
                <div key={item} style={ingresoRow}>
                  <span style={ingresoLabel}>{item}</span>
                  <input
                    type="number"
                    placeholder="ml"
                    value={balance.ingresos[item]}
                    onChange={(e) =>
                      updateBalance("ingresos", {
                        ...balance.ingresos,
                        [item]: e.target.value,
                      })
                    }
                    style={ingresoInput}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EGRESOS */}
        <div style={{ ...subCard, borderColor: "#fb718540" }}>
          <div
            style={{ ...subHeader, color: "#fb7185", cursor: "pointer" }}
            onClick={() => setOpenEgresos(!openEgresos)}
          >
            <ArrowUpCircle size={18} />
            EGRESOS
            <span style={{ marginLeft: "auto", fontSize: 13 }}>
              {totalEgresos} ml
            </span>
            {openEgresos ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>

          {openEgresos && (
            <div style={nestedList}>
              {Object.keys(balance.egresos).map((e) => (
                <div key={e} style={ingresoRow}>
                  <span style={ingresoLabel}>{e}</span>
                  <input
                    type="number"
                    placeholder="ml"
                    value={balance.egresos[e]}
                    onChange={(ev) =>
                      updateBalance("egresos", {
                        ...balance.egresos,
                        [e]: ev.target.value,
                      })
                    }
                    style={ingresoInput}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BALANCE */}
        <div style={{ ...subCard, borderColor: "#60a5fa40" }}>
          <div style={{ ...subHeader, color: "#60a5fa" }}>
            <Droplet size={18} />
            BALANCE INTRA-CEC
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 36,
              fontWeight: 900,
              color: "white",
              marginTop: 12,
            }}
          >
            {balanceIntraCEC} ml
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTES ================= */

function Section({
  title,
  open,
  toggle,
  data,
  setData,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  data: Record<string, string>;
  setData: (v: Record<string, string>) => void;
}) {
  return (
    <div>
      <div style={sectionHeader} onClick={toggle}>
        <span>{title}</span>
        {open ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </div>

      {open && (
        <div style={nestedList}>
          {Object.keys(data ?? {}).map((k) => (
            <div key={k} style={ingresoRow}>
              <span style={ingresoLabel}>{k}</span>
              <input
                type="number"
                placeholder="ml"
                value={data[k]}
                onChange={(e) =>
                  setData({ ...data, [k]: e.target.value })
                }
                style={ingresoInput}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= ESTILOS ================= */

const card = {
  background: "#1e293b",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #334155",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontWeight: 800,
  fontSize: 18,
  color: "#5eead4",
  marginBottom: 24,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const subCard = {
  background: "#020617",
  borderRadius: 18,
  padding: 20,
  border: "1px solid",
};

const subHeader = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: 1,
  marginBottom: 16,
};

const ingresosList = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 16,
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1,
  color: "#e5e7eb",
  cursor: "pointer",
};

const nestedList = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 10,
  marginTop: 10,
  paddingLeft: 10,
};

const ingresoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const ingresoLabel = {
  fontSize: 13,
  color: "#e5e7eb",
};

const ingresoInput = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 8,
  padding: "6px 8px",
  color: "white",
  width: 90,
  textAlign: "center" as const,
};