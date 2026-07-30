import { GoogleGenAI } from "@google/genai";
import { NextResponse, type NextRequest } from "next/server";
import type { AiInsightRequest } from "@/features/ai-insight/types";
import { TtlCache } from "@/lib/ttl-cache";

// Server-only: GEMINI_API_KEY is never exposed to the client, this route
// runs on the Next.js server. Model choice: Gemini 2.5 Flash-Lite — this is
// a short summarization task (technical snapshot -> narrative), not
// reasoning-heavy, and PRD explicitly calls for controlled API cost.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 jam, per PRD 4.3 (kontrol biaya)
const insightCache = new TtlCache<string>(CACHE_TTL_MS, 256);

const SYSTEM_PROMPT = `Kamu adalah asisten analisis teknikal saham IDX (Bursa Efek Indonesia).
Berdasarkan data teknikal yang diberikan, buat ringkasan naratif singkat (3-5 kalimat) dalam
Bahasa Indonesia yang menjelaskan kondisi saham secara objektif: tren harga, momentum
(RSI/MACD), dan posisi terhadap support/resistance.

Aturan penting:
- JANGAN memberikan rekomendasi beli/jual eksplisit atau nasihat keuangan.
- Cukup deskripsikan apa yang ditunjukkan data secara netral dan informatif.
- Gunakan bahasa naratif mengalir, bukan bullet point.
- Jangan mengulang angka mentah secara berlebihan — jelaskan maknanya.`;

function buildUserPrompt(data: AiInsightRequest): string {
  const fmt = (n: number | null) => (n == null ? "-" : n.toLocaleString("id-ID"));

  return `Data teknikal untuk saham ${data.ticker}:
- Harga saat ini: Rp ${fmt(data.current_price)} (${data.change_percent >= 0 ? "+" : ""}${data.change_percent.toFixed(2)}%)
- Trend: ${data.trend}
- Signal: ${data.signal}
- RSI (14): ${fmt(data.rsi_14)}
- MACD: ${fmt(data.macd)} vs Signal ${fmt(data.macd_signal)}
- SMA 20: ${fmt(data.sma_20)}, SMA 50: ${fmt(data.sma_50)}
- Support terdekat: ${fmt(data.support_1)}
- Resistance terdekat: ${fmt(data.resistance_1)}

Buat ringkasan naratif singkat berdasarkan data di atas.`;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<AiInsightRequest>;

  if (!body.ticker || body.current_price == null) {
    return NextResponse.json({ detail: "Data teknikal tidak lengkap." }, { status: 400 });
  }
  const data = body as AiInsightRequest;

  const cacheKey = data.ticker.toUpperCase();
  const cached = insightCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ narrative: cached, cached: true });
  }

  let narrative: string;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: buildUserPrompt(data),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 512,
      },
    });

    narrative = response.text ?? "";
  } catch {
    return NextResponse.json({ detail: "Gagal membuat AI insight." }, { status: 502 });
  }

  insightCache.set(cacheKey, narrative);

  return NextResponse.json({ narrative, cached: false });
}
