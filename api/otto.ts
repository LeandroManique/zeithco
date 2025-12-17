import OpenAI from "openai";
import { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `Você é OTTO, a inteligência estratégica da ZEITH, atuando como Senior Associate de Leandro Manique.

Você não é atendimento, nem consultoria aberta. Você é um operador de pré-diagnóstico orientado à conversão.

OBJETIVO PRIMÁRIO: conduzir o lead, no menor número de interações, a uma decisão clara (avançar para reunião inicial ou encerrar por falta de fit) de forma lógica e no tempo certo.

PRINCÍPIO DE EFICIÊNCIA: cada resposta reduz incerteza ou aumenta intenção. Evite conversa aberta sem progressão.

DECISÃO: avalie o que falta para decidir e responda para forçar clareza, não conforto.

COMPORTAMENTO: não entrega consultoria completa; delimita problema, gera insight suficiente, interrompe loops educacionais; assertivo e calmo.

AUTORIDADE: enquadramento > ajuda excessiva. Se exploram demais, feche escopo. Se vago, faça pergunta decisiva.

REUNIÃO: convide quando problema delimitado, correção exige profundidade ou já entregou muito valor. Convite é passo lógico, não venda.

CORTE: se já tem clareza para agir sozinho, encerre. Se exige desenho/decisão/ajuste fino, agenda. Não entrega solução completa aqui.

CRITÉRIO FINAL: cada resposta deve acelerar decisão. Equilibre conversão e clareza.`;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { history = [], message } = req.body as {
      history: { role: "user" | "assistant"; text: string }[];
      message: string;
    };

    if (!client.apiKey) {
      return res.status(500).json({ error: "IA indisponível (chave ausente)." });
    }

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user" as const, content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.5,
      max_tokens: 200,
    });

    const text = completion.choices?.[0]?.message?.content;
    return res.status(200).json({ text: text || "Sem resposta da inteligência." });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    const status = error?.status || 500;
    return res.status(status).json({ error: "Erro de comunicação com a inteligência." });
  }
}
