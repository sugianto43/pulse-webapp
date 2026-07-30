import GlossaryAccordion from "@/components/GlossaryAccordion";

const TERMS = [
  {
    term: "Bandarmology",
    description:
      "Analisis pola transaksi broker untuk menebak apakah 'pemain besar' (bandar/institusi) sedang mengumpulkan (akumulasi) atau melepas (distribusi) saham.",
  },
  {
    term: "Smart Money & Bandar",
    description:
      "Kelompok broker yang secara historis konsisten profit/menggerakkan harga — dianggap merepresentasikan investor besar/institusi, bukan investor retail biasa.",
  },
  {
    term: "Flow Momentum & Markup Readiness",
    description:
      "Flow Momentum = seberapa kuat arus beli bersih belakangan ini. Markup Readiness = seberapa siap saham ini untuk naik (breakout) berdasarkan pola akumulasi.",
  },
  {
    term: "Accumulation Phase",
    description:
      "Fase di mana pihak besar diam-diam mengumpulkan saham sebelum harga naik signifikan — kebalikan dari distribution (fase melepas saham sebelum turun).",
  },
];

export default function BrokerGlossary() {
  return <GlossaryAccordion title="Istilah Broker Flow" terms={TERMS} />;
}
