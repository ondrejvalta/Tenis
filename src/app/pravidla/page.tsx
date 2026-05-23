import Image from "next/image";

export const metadata = { title: "Pravidla | Tenisová liga Dobříš" };

export default function PravidlaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Pravidla</h1>
      <Image
        src="/amatérská_liga_pravidla.jpg"
        alt="Pravidla amatérské tenisové ligy"
        width={1200}
        height={1600}
        className="w-full rounded-xl border border-neutral-200"
      />
    </div>
  );
}
