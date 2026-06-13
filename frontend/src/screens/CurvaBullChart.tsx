interface Props {
  actBasal: number;
  actPost: number;
  actObjetivo: number;
  dosisInicial: number;
  dosisNecesaria: number;
  actFinal: number;
}

export default function CurvaBullChart({
  actBasal,
  actPost,
  actObjetivo,
  dosisInicial,
  dosisNecesaria,
  actFinal,
}: Props) {

  /* ================= MÁS PEQUEÑA ================= */

  const width = 620;
  const height = 360;

  const maxACT = 600;
  const maxDose = 10;

  const padding = 55;

  const mapX = (act: number) =>
    padding +
    (act / maxACT) *
      (width - padding * 2);

  const mapY = (dose: number) =>
    height -
    padding -
    (dose / maxDose) *
      (height - padding * 2);

  const xA = mapX(actBasal || 0);
  const yA = mapY(0);

  const xB = mapX(actPost || 0);
  const yB = mapY(dosisInicial);

  const xC = mapX(actObjetivo || 480);
  const yC = mapY(dosisNecesaria || 0);

  const xD = mapX(actFinal || 0);

  /* ================= RESPUESTA REAL ================= */

  const diferenciaACT =
    Math.max(
      0,
      actObjetivo - actFinal
    );

  const reduccion =
    diferenciaACT / 120;

  const yD =
    mapY(
      Math.max(
        0.5,
        (dosisNecesaria || 0) - reduccion
      )
    );

  const xIntermedio =
    (xC + xD) / 2;

  const yIntermedio =
    (yC + yD) / 2;

  return (

    <div
      style={{
        marginTop: 20,
        background: "#020617",
        borderRadius: 22,
        padding: 16,
        border: "1px solid #134e4a",
      }}
    >

      <h3
        style={{
          color: "#5eead4",
          marginBottom: 12,
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Curva Bull Dosis-Respuesta
      </h3>

      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
      >

        {/* GRID VERTICAL */}

        {Array.from({ length: 14 }).map((_, i) => {

          const x =
            padding +
            i *
              ((width - padding * 2) / 12);

          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke="#334155"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}

        {/* GRID HORIZONTAL */}

        {Array.from({ length: 11 }).map((_, i) => {

          const y =
            padding +
            i *
              ((height - padding * 2) / 10);

          return (
            <line
              key={`h-${i}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}

        {/* EJES */}

        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="2.5"
        />

        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="2.5"
        />

        {/* NUMEROS X */}

        {Array.from({ length: 14 }).map((_, i) => {

          const value =
            i === 13
              ? ">600"
              : i * 50;

          const x =
            padding +
            i *
              ((width - padding * 2) / 13);

          return (
            <text
              key={`xtext-${i}`}
              x={x}
              y={height - padding + 22}
              fill="white"
              fontSize="10"
              textAnchor="middle"
            >
              {value}
            </text>
          );
        })}

        {/* NUMEROS Y */}

        {Array.from({ length: 11 }).map((_, i) => {

          const value = 10 - i;

          const y =
            padding +
            i *
              ((height - padding * 2) / 10);

          return (
            <text
              key={`ytext-${i}`}
              x={padding - 14}
              y={y + 4}
              fill="white"
              fontSize="10"
              textAnchor="middle"
            >
              {value}
            </text>
          );
        })}

        {/* LINEA 480 */}

        <line
          x1={xC}
          y1={padding}
          x2={xC}
          y2={height - padding}
          stroke="#ef4444"
          strokeDasharray="6 6"
          strokeWidth="2.5"
        />

        {/* TEXTO 480 */}

        <text
          x={xC}
          y={height - padding + 36}
          fill="#ef4444"
          fontSize="13"
          fontWeight="700"
          textAnchor="middle"
        >
          480
        </text>

        {/* LINEA A-B-C */}

        <polyline
          points={`
            ${xA},${yA}
            ${xB},${yB}
            ${xC},${yC}
          `}
          fill="none"
          stroke="#5eead4"
          strokeWidth="4"
        />

        {/* PUNTO A */}

        <circle
          cx={xA}
          cy={yA}
          r="7"
          fill="#22c55e"
        />

        <text
          x={xA - 8}
          y={yA - 14}
          fill="#22c55e"
          fontSize="16"
          fontWeight="700"
        >
          A
        </text>

        {/* PUNTO B */}

        <circle
          cx={xB}
          cy={yB}
          r="7"
          fill="#3b82f6"
        />

        <text
          x={xB - 8}
          y={yB - 14}
          fill="#3b82f6"
          fontSize="16"
          fontWeight="700"
        >
          B
        </text>

        {/* PUNTO C */}

        <circle
          cx={xC}
          cy={yC}
          r="8"
          fill="#facc15"
          stroke="#fde047"
          strokeWidth="2"
        />

        <text
          x={xC - 10}
          y={yC - 14}
          fill="#facc15"
          fontSize="18"
          fontWeight="700"
        >
          C
        </text>

        {/* RESPUESTA REAL */}

        {actFinal > 0 &&
         actFinal < 480 && (

          <>

            <path
              d={`
                M ${xA} ${yA}
                Q ${xB} ${yB}
                  ${xIntermedio} ${yIntermedio}
              `}
              fill="none"
              stroke="#fb923c"
              strokeWidth="4"
              strokeDasharray="8 5"
            />

            {/* PUNTO D */}

            <circle
              cx={xD}
              cy={yD}
              r="8"
              fill="#f97316"
              stroke="#fdba74"
              strokeWidth="2"
            />

            <text
              x={xD + 8}
              y={yD + 8}
              fill="#f97316"
              fontSize="18"
              fontWeight="700"
            >
              D
            </text>

            <text
              x={xD + 14}
              y={yD + 24}
              fill="#fb923c"
              fontSize="10"
              fontWeight="600"
            >
              ACT real &lt; 480
            </text>

          </>
        )}

        {/* LABEL X */}

        <text
          x={width / 2}
          y={height - 4}
          fill="#22d3ee"
          fontSize="15"
          fontWeight="700"
          textAnchor="middle"
        >
          ACT en segundos
        </text>

        {/* LABEL Y */}

        <text
          x={-height / 2}
          y={18}
          transform="rotate(-90)"
          fill="#22d3ee"
          fontSize="15"
          fontWeight="700"
          textAnchor="middle"
        >
          Heparina mg/kg
        </text>

        {/* X Y */}

        <text
          x={width - 14}
          y={height - padding + 8}
          fill="#5eead4"
          fontSize="18"
          fontWeight="700"
        >
          X
        </text>

        <text
          x={padding - 8}
          y={padding - 12}
          fill="#5eead4"
          fontSize="18"
          fontWeight="700"
        >
          Y
        </text>

      </svg>

    </div>
  );
}