import { PlayerForm } from "../PlayerForm";
import { createPlayer } from "../actions";

export const metadata = { title: "Nový hráč – Administrace" };

export default function NewPlayerPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nový hráč</h1>
      <PlayerForm action={createPlayer} submitLabel="Vytvořit" />
    </div>
  );
}
