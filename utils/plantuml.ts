/**
 * PlantUML uses a custom Base64 encoding scheme and raw Deflate compression.
 * This utility handles the conversion from text string to PlantUML image URL.
 */

const PLANTUML_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function encode6bit(b: number): string {
  if (b < 10) return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return '-';
  if (b === 1) return '_';
  return '?';
}

function append3bytes(b1: number, b2: number, b3: number): string {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0x0f) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;
  return (
    encode6bit(c1 & 0x3f) +
    encode6bit(c2 & 0x3f) +
    encode6bit(c3 & 0x3f) +
    encode6bit(c4 & 0x3f)
  );
}

function encodePlantUMLBase64(data: Uint8Array): string {
  let r = "";
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 === data.length) {
      r += append3bytes(data[i], data[i + 1], 0);
    } else if (i + 1 === data.length) {
      r += append3bytes(data[i], 0, 0);
    } else {
      r += append3bytes(data[i], data[i + 1], data[i + 2]);
    }
  }
  return r;
}

export const encodePlantUML = async (text: string): Promise<string> => {
  if (!text.trim()) return "";

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Use the native CompressionStream API (Raw Deflate)
  const stream = new CompressionStream('deflate-raw');
  const writer = stream.writable.getWriter();
  writer.write(data);
  writer.close();

  const buffer = await new Response(stream.readable).arrayBuffer();
  const compressedData = new Uint8Array(buffer);

  const encoded = encodePlantUMLBase64(compressedData);
  return `https://www.plantuml.com/plantuml/svg/${encoded}`;
};
