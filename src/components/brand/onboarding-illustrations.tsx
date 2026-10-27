import Svg, {
    Circle,
    Ellipse,
    Path,
    Polygon,
    Rect,
    Text as SvgText,
} from "react-native-svg";

import { Colors } from "@/constants/theme";

const P = Colors.primary;
const SOFT = "#EFE6F4";
const GROUND = "#F1F1F4";
const DARK = "#2B2B35";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <Svg width="100%" height={260} viewBox="0 0 300 260">
      <Ellipse cx={150} cy={225} rx={120} ry={26} fill={GROUND} />
      {children}
    </Svg>
  );
}

/** Slide 1: phone with signal waves and data packages. */
export function DataIllustration() {
  return (
    <Frame>
      {/* Phone */}
      <Rect x={105} y={40} width={90} height={170} rx={16} fill={P} />
      <Rect x={112} y={50} width={76} height={150} rx={10} fill="#fff" />
      {/* Signal waves */}
      <Path
        d="M140.1 115.1 A14 14 0 0 1 159.9 115.1"
        stroke={P}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M131.6 106.6 A26 26 0 0 1 168.4 106.6"
        stroke={P}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M123.1 98.1 A38 38 0 0 1 176.9 98.1"
        stroke={P}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={150} cy={125} r={5} fill={P} />
      {/* Rows + button */}
      <Rect x={124} y={150} width={52} height={8} rx={4} fill={SOFT} />
      <Rect x={124} y={165} width={36} height={8} rx={4} fill={SOFT} />
      <Rect x={124} y={182} width={52} height={12} rx={6} fill={P} />

      {/* Floating data packages */}
      <Rect x={34} y={88} width={58} height={44} rx={10} fill={SOFT} />
      <Rect
        x={28}
        y={80}
        width={58}
        height={44}
        rx={10}
        fill="#fff"
        stroke={P}
        strokeWidth={2}
      />
      <SvgText
        x={57}
        y={108}
        fontSize={16}
        fontWeight="bold"
        fill={P}
        textAnchor="middle"
      >
        4G
      </SvgText>

      <Rect x={218} y={118} width={58} height={44} rx={10} fill={SOFT} />
      <Rect x={212} y={110} width={58} height={44} rx={10} fill={P} />
      <SvgText
        x={241}
        y={138}
        fontSize={15}
        fontWeight="bold"
        fill="#fff"
        textAnchor="middle"
      >
        5 GB
      </SvgText>

      {/* Sparkles */}
      <Circle cx={60} cy={160} r={5} fill={P} fillOpacity={0.35} />
      <Circle cx={238} cy={70} r={6} fill={P} fillOpacity={0.35} />
      <Circle cx={90} cy={50} r={3} fill={P} fillOpacity={0.5} />
    </Frame>
  );
}

/** Slide 2: dashboard card with bars, donut and a magnifier. */
export function UsageIllustration() {
  const bars = [30, 55, 40, 75, 60];
  return (
    <Frame>
      <Rect x={66} y={58} width={180} height={150} rx={18} fill={SOFT} />
      <Rect
        x={60}
        y={50}
        width={180}
        height={150}
        rx={18}
        fill="#fff"
        stroke="#E8E1EE"
        strokeWidth={2}
      />
      <Rect x={78} y={66} width={60} height={8} rx={4} fill={P} />
      <Rect x={78} y={80} width={36} height={6} rx={3} fill={SOFT} />

      {/* Donut */}
      <Circle
        cx={205}
        cy={92}
        r={22}
        stroke={SOFT}
        strokeWidth={8}
        fill="none"
      />
      <Circle
        cx={205}
        cy={92}
        r={22}
        stroke={P}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray="90 138"
        rotation={-90}
        originX={205}
        originY={92}
        fill="none"
      />

      {/* Bars */}
      {bars.map((h, i) => (
        <Rect
          key={i}
          x={80 + i * 26}
          y={182 - h}
          width={18}
          height={h}
          rx={5}
          fill={P}
          fillOpacity={i === 3 ? 1 : 0.35}
        />
      ))}

      {/* Magnifier */}
      <Circle
        cx={232}
        cy={188}
        r={20}
        fill="#fff"
        fillOpacity={0.7}
        stroke={P}
        strokeWidth={6}
      />
      <Path
        d="M247 203 L267 223"
        stroke={P}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </Frame>
  );
}

/** Slide 3: support agent with headset and chat bubbles. */
export function SupportIllustration() {
  return (
    <Frame>
      {/* Shoulders */}
      <Path
        d="M95 215 C95 170 125 160 150 160 C175 160 205 170 205 215 Z"
        fill={P}
      />
      {/* Head + hair */}
      <Circle cx={150} cy={110} r={34} fill="#F2C9A5" />
      <Path
        d="M116 108 C116 78 184 78 184 108 C176 92 124 92 116 108 Z"
        fill="#3B2A3F"
      />
      {/* Face */}
      <Circle cx={138} cy={114} r={3} fill={DARK} />
      <Circle cx={162} cy={114} r={3} fill={DARK} />
      <Path
        d="M140 127 Q150 135 160 127"
        stroke="#8A4B3A"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      {/* Headset */}
      <Path
        d="M114 112 C110 70 190 70 186 112"
        stroke={DARK}
        strokeWidth={7}
        fill="none"
      />
      <Rect x={106} y={102} width={14} height={26} rx={6} fill={DARK} />
      <Rect x={180} y={102} width={14} height={26} rx={6} fill={DARK} />
      <Path
        d="M113 126 C115 146 130 150 142 148"
        stroke={DARK}
        strokeWidth={4}
        fill="none"
      />
      <Circle cx={144} cy={148} r={5} fill={DARK} />

      {/* Left bubble: typing dots */}
      <Rect x={28} y={60} width={70} height={42} rx={14} fill={SOFT} />
      <Polygon points="76,102 90,102 82,115" fill={SOFT} />
      <Circle cx={48} cy={81} r={5} fill={P} />
      <Circle cx={63} cy={81} r={5} fill={P} fillOpacity={0.7} />
      <Circle cx={78} cy={81} r={5} fill={P} fillOpacity={0.4} />

      {/* Right bubble: 24/7 */}
      <Rect x={205} y={38} width={76} height={44} rx={14} fill={P} />
      <Polygon points="216,82 230,82 220,95" fill={P} />
      <SvgText
        x={243}
        y={67}
        fontSize={18}
        fontWeight="bold"
        fill="#fff"
        textAnchor="middle"
      >
        24/7
      </SvgText>
    </Frame>
  );
}
