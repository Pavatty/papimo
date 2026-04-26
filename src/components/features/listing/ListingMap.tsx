type Props = {
  latitude: number | null;
  longitude: number | null;
  isRecent: boolean;
};

export async function ListingMap({ latitude, longitude, isRecent }: Props) {
  if (!latitude || !longitude) return null;

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const approxLat = Number((latitude + 0.002).toFixed(6));
  const approxLon = Number((longitude - 0.002).toFixed(6));
  const shownLat = isRecent ? latitude : approxLat;
  const shownLon = isRecent ? longitude : approxLon;

  let pois: string[] = [];
  if (token) {
    const query = `${shownLon},${shownLat}`;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&types=poi&limit=5`,
      { next: { revalidate: 1800 } },
    );
    if (response.ok) {
      const data = await response.json();
      pois = (data.features ?? []).map((f: { text: string }) => f.text);
    }
  }

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h2 className="text-ink mb-3 text-lg font-semibold">Localisation</h2>
      {!isRecent ? (
        <p className="text-ink-soft mb-3 text-xs">
          Position approximative (zone de 300m) pour protéger la confidentialité
          du vendeur.
        </p>
      ) : null}
      {token ? (
        <iframe
          title="Carte annonce"
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12.html?title=false&zoomwheel=true&fresh=true#14/${shownLat}/${shownLon}`}
          className="border-line h-[400px] w-full rounded-xl border"
        />
      ) : (
        <div className="border-line bg-creme-pale flex h-[240px] items-center justify-center rounded-xl border">
          <p className="text-ink-soft text-sm">
            Carte indisponible (token Mapbox absent).
          </p>
        </div>
      )}

      {pois.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-ink mb-2 text-sm font-medium">
            Points d&#39;intérêt à proximité
          </h3>
          <ul className="text-ink-soft grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            {pois.map((poi) => (
              <li key={poi}>• {poi}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
