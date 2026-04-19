export type CharSetName =
  | "standard"
  | "simple"
  | "detailed"
  | "blocks"
  | "binary"
  | "braille"
  | "matrix"
  | "dots"
  | "slashes"
  | "numbers"
  | "mixed";

export type ColorMode =
  | "matrix"
  | "cyan"
  | "amber"
  | "red"
  | "violet"
  | "white"
  | "neon"
  | "gold"
  | "pink"
  | "aqua"
  | "rainbow"
  | "heatmap";

export type BgColor = "black" | "darkGreen" | "darkBlue" | "darkRed" | "white";

export interface AsciiSettings {
  charSet: CharSetName;
  colorMode: ColorMode;
  bgColor: BgColor;
  columns: number;
  charSize: number;
  contrast: number;
  colorFromVideo: boolean;
  invertBrightness: boolean;
  mirrorH: boolean;
  edgeMode: boolean;
  mediaPipeEnabled: boolean;
}

export interface EngineStats {
  fps: number;
  cols: number;
  rows: number;
}

export type SegmentationMask = Uint8Array | null;

export const DEFAULT_SETTINGS: AsciiSettings = {
  charSet: "standard",
  colorMode: "matrix",
  bgColor: "black",
  columns: 200,
  charSize: 10,
  contrast: 1.2,
  colorFromVideo: false,
  invertBrightness: false,
  mirrorH: true,
  edgeMode: false,
  mediaPipeEnabled: false,
};

export const CHAR_SETS: Record<CharSetName, string> = {
  standard: " .,:;i1tfLCG08@",
  simple: " .:-=+*#%@",
  detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks: " ░▒▓█",
  binary: " 01",
  braille: " ⠁⠃⠇⡇⣇⣧⣷⣿",
  matrix: " ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀ",
  dots: " ·•●",
  slashes: " /|\\-",
  numbers: " 1234567890",
  mixed: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$░▒▓█01⠁⠃⠇⡇⣇⣧⣷⣿ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ·•●/|\\-1234567890",
};

export const BG_COLOR_VALUES: Record<BgColor, string> = {
  black: "#000000",
  darkGreen: "#001a00",
  darkBlue: "#00001a",
  darkRed: "#1a0000",
  white: "#f0f0f0",
};

export const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  matrix: "Matrix",
  cyan: "Cyan",
  amber: "Amber",
  red: "Red",
  violet: "Violet",
  white: "White",
  neon: "Neon",
  gold: "Gold",
  pink: "Pink",
  aqua: "Aqua",
  rainbow: "Rainbow",
  heatmap: "Heatmap",
};

export const COLOR_MODE_PREVIEW: Record<ColorMode, string> = {
  matrix: "#00FF41",
  cyan: "#00FFFF",
  amber: "#FF9B21",
  red: "#FF4444",
  violet: "#BB44FF",
  white: "#EEEEEE",
  neon: "#39FF14",
  gold: "#FFD700",
  pink: "#FF69B4",
  aqua: "#00CED1",
  rainbow: "linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)",
  heatmap: "linear-gradient(90deg,#00f,#0ff,#0f0,#ff0,#f00)",
};
