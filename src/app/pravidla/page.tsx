export const metadata = { title: "Pravidla | Tenisová liga Dobříš" };

export default function PravidlaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pravidla</h1>
        <p className="mt-1 text-sm text-neutral-600">Amatérská liga TenisCentrum Dobříš</p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 text-base font-semibold">1. Základní informace</h2>
          <p className="text-sm text-neutral-700">
            Amatérská liga TenisCentrum Dobříš je určena pro rekreační a amatérské hráče tenisu kategorie dospělých. Cílem soutěže je podpořit pravidelné hraní tenisu, fair play a přátelskou sportovní atmosféru.
          </p>
          <p className="mt-1 text-sm text-neutral-700">Pořadatelem ligy je TenisCentrum Dobříš.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">2. Účastníci</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Liga je určena pro amatérské hráče.</li>
            <li>Do ligy se mohou přihlásit hráči starší 18 let.</li>
            <li>Organizátor si vyhrazuje právo odmítnout hráče s výkonností výrazně převyšující úroveň soutěže.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">3. Herní systém</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Liga se hraje systémem „každý s každým" ve skupinách.</li>
            <li>Počet hráčů ve skupině určí organizátor podle počtu přihlášených.</li>
            <li>Soutěž může být rozdělena do více výkonnostních skupin.</li>
            <li>Po skončení základní části postupují hráči do finálového play-off, kde se hraje systémem pavouka. Nasazení určuje pořadí ve skupině. Pavouk s nasazením bude představen již před zahájením losování turnaje.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">4. Termíny zápasů</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Hráči si termín zápasu domlouvají mezi sebou.</li>
            <li>Pokud se hráči nedohodnou, může organizátor určit závazný termín zápasu.</li>
            <li>Neodehraný zápas může být kontumován.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">5. Herní pravidla</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Hraje se dle platných pravidel ČTS.</li>
            <li>Zápas se hraje na 2 vítězné sety.</li>
            <li>Za stavu 1:1 na sety následuje supertiebreak do 10 bodů.</li>
            <li>Ve všech setech se hraje tiebreak za stavu 6:6.</li>
            <li>Hráči si před zápasem zajistí dostatek míčů vhodných pro hru.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">6. Povrch a kurty</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Zápasy se hrají na antukových kurtech.</li>
            <li>Rezervaci kurtu provádějí hráči podle pokynů klubu.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">7. Bodování</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Výhra – 3 body</li>
            <li>Prohra – 1 bod</li>
            <li>Kontumace – 0 bodů</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">8. Pořadí ve skupině</h2>
          <p className="mb-1 text-sm text-neutral-700">Pořadí ve skupině určuje:</p>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>· Počet bodů</li>
            <li>· Vzájemný zápas</li>
            <li>· Rozdíl setů</li>
            <li>· Rozdíl gamů</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">9. Kontumace a skreče</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Hráč, který bez omluvy opakovaně nekomunikuje nebo nenastoupí k zápasům, může být ze soutěže vyřazen.</li>
            <li>Kontumační výsledek je stanoven 6:0 6:0.</li>
            <li>Při skreči během zápasu zůstanou dohrané gamy zachovány a soupeř získává vítězství.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">10. Fair play a chování hráčů</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Od všech hráčů se očekává slušné a sportovní chování.</li>
            <li>Hrubé nesportovní chování, vulgarity nebo ničení majetku mohou vést k vyloučení ze soutěže.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">11. Startovné</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Výše startovného je stanovena na 600,- Kč.</li>
            <li>Startovné musí být uhrazeno před prvním zápasem.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">12. Výsledky a komunikace</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Výsledky zasílají hráči bezprostředně po utkání do WhatsApp skupiny.</li>
            <li>Komunikace probíhá prostřednictvím WhatsApp skupiny.</li>
            <li>Aktuální tabulka bude pravidelně zveřejňována.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">13. Organizátor</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>Organizátor si vyhrazuje právo pravidla upravit v průběhu soutěže.</li>
            <li>Přihlášením do soutěže hráč potvrzuje souhlas s těmito pravidly.</li>
            <li>Hlavním cílem ligy je radost ze hry, pravidelný pohyb a přátelská atmosféra.</li>
          </ul>
          <p className="mt-3 text-sm font-medium text-neutral-700">Přejeme všem hráčům mnoho sportovních zážitků a fair play zápasů.</p>
        </section>
      </div>
    </div>
  );
}
