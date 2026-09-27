import { useMemo, useState } from "react";

const CATS: { name: string; items: [string, string][] }[] = [
  { name: "Smileys", items: [["😀","Grinning Face"],["😃","Big Eyes"],["😄","Smiling Eyes"],["😁","Beaming Face"],["😆","Squinting Face"],["😅","Sweat Smile"],["🤣","Rolling Laughing"],["😂","Tears Of Joy"],["🙂","Slight Smile"],["🙃","Upside Down"],["🫠","Melting Face"],["😉","Winking Face"],["😊","Blushing"],["😇","Halo"],["🥰","Hearts"],["😍","Heart Eyes"],["🤩","Star Struck"],["😎","Sunglasses"]] },
  { name: "People", items: [["👋","Waving Hand"],["👍","Thumbs Up"],["👏","Clapping"],["🙌","Raised Hands"],["🤝","Handshake"],["💪","Flexed Biceps"],["✌️","Victory"],["🤞","Crossed Fingers"],["👀","Eyes"],["🧠","Brain"]] },
  { name: "Nature", items: [["🐶","Dog"],["🐱","Cat"],["🦊","Fox"],["🐼","Panda"],["🦄","Unicorn"],["🐝","Bee"],["🌵","Cactus"],["🌸","Blossom"],["🌈","Rainbow"],["🌊","Wave"]] },
  { name: "Food", items: [["🍋","Lemon"],["🍓","Strawberry"],["🍕","Pizza"],["🍔","Burger"],["🌮","Taco"],["🍩","Doughnut"],["☕","Coffee"],["🍹","Cocktail"],["🍰","Cake"],["🥑","Avocado"]] },
  { name: "Travel", items: [["🚀","Rocket"],["✈️","Airplane"],["🚲","Bicycle"],["🏝️","Island"],["🗼","Tower"],["🌍","Globe"],["🏔️","Mountain"],["🚗","Car"]] },
  { name: "Objects", items: [["💡","Light Bulb"],["📦","Package"],["🎁","Gift"],["📱","Phone"],["💻","Laptop"],["📸","Camera"],["🎧","Headphones"],["🔑","Key"]] },
  { name: "Symbols", items: [["✨","Sparkles"],["🔥","Fire"],["⚡","Lightning"],["❤️","Red Heart"],["⭐","Star"],["💯","Hundred"],["✅","Check"],["🎉","Party"]] },
];

export function EmojiPicker({ onPick }: { onPick: (e: string) => void }) {
  const [cat, setCat] = useState(CATS[0]!.name);
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    if (q.trim()) return CATS.flatMap((c) => c.items).filter(([, n]) => n.toLowerCase().includes(q.toLowerCase()));
    return CATS.find((c) => c.name === cat)?.items ?? [];
  }, [cat, q]);
  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Pick your emoji</p>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search emoji…" aria-label="Search emoji" className="h-10 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56" />
      </div>
      {!q && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {CATS.map((c) => (
            <button key={c.name} type="button" onClick={() => setCat(c.name)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${cat === c.name ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {c.name} <span className="opacity-60">{c.items.length}</span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {list.map(([e, n]) => (
          <button key={e + n} type="button" onClick={() => onPick(e)} title={`Add ${n}`} className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-3 transition-all hover:-translate-y-px hover:shadow-lift">
            <span className="text-3xl">{e}</span>
            <span className="text-center text-[11px] leading-tight text-muted-foreground">{n}</span>
          </button>
        ))}
        {list.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No emoji match that search.</p>}
      </div>
    </div>
  );
}
