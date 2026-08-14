import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import { COUNTRY_DATA } from "@/utils/gameSeoConfigs";

const GAMES = [
  { slug: "pubgm", label: "PUBG Mobile UC" },
];

const CountriesDirectoryPage = () => {
  const entries = Object.entries(COUNTRY_DATA);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <Helmet>
        <title>All Countries — Midasbuy Game Top-Up Store Directory</title>
        <meta
          name="description"
          content={`Browse Midasbuy top-up stores for ${entries.length} countries: buy PUBG Mobile UC at the best price in your local currency with instant delivery.`}
        />
        <link rel="canonical" href="https://www.midasbuy.com.pk/countries" />
      </Helmet>

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-3xl font-bold">Midasbuy Country Directory</h1>
        <p className="mb-8 text-muted-foreground">
          Choose your country to see PUBG Mobile UC prices in your local currency.
        </p>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([code, country]) => {
            const cc = code.toLowerCase();
            return (
              <li key={code} className="rounded-xl border border-border bg-card p-4">
                <Link to={`/midasbuy/${cc}/buy/pubgm`} className="font-semibold text-primary">
                  Midasbuy {country.name}
                </Link>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {GAMES.map((g) => (
                    <Link key={g.slug} to={`/midasbuy/${cc}/buy/${g.slug}`} className="text-muted-foreground hover:underline">
                      {g.label}
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CountriesDirectoryPage;
