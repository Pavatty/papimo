"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useTheme } from "next-themes";
import "mapbox-gl/dist/mapbox-gl.css";

import type { SearchResult } from "./SearchPage";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export function SearchMap({ results }: { results: SearchResult[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const { resolvedTheme } = useTheme();
  const mapStyle =
    resolvedTheme === "dark"
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/streets-v12";

  useEffect(() => {
    if (!mapContainer.current || map.current || !MAPBOX_TOKEN) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [10.18, 36.81],
      zoom: 9,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const validResults = results.filter((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      return (
        Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0
      );
    });
    validResults.forEach((listing) => {
      const el = document.createElement("div");
      el.className =
        "papimo-price-marker bg-corail text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:opacity-90 transition whitespace-nowrap";
      el.style.willChange = "transform";
      el.textContent = `${(Number(listing.price) / 1000).toFixed(0)}k`;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <img src="${listing.main_photo}" class="w-full h-24 object-cover rounded mb-2" />
          <p class="font-bold text-sm">${listing.title}</p>
          <p class="text-red-500 font-bold">${Number(listing.price).toLocaleString()} ${listing.price_currency}</p>
          <p class="text-xs text-gray-500">${listing.surface_area}m² · ${listing.rooms_total} pièces</p>
          <a href="/annonce/${listing.slug ?? listing.id}" class="text-blue-600 text-xs underline mt-2 block">Voir l'annonce</a>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([Number(listing.longitude), Number(listing.latitude)])
        .setPopup(popup)
        .addTo(map.current!);
      markers.current.push(marker);
    });

    if (validResults.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validResults.forEach((item) =>
        bounds.extend([Number(item.longitude), Number(item.latitude)]),
      );
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
    }
  }, [results]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="border-line text-ink-soft flex h-full min-h-[500px] w-full items-center justify-center rounded-xl border bg-white p-6 text-center text-sm">
        Carte indisponible — token Mapbox non configuré.
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="h-full min-h-[500px] w-full overflow-hidden rounded-xl"
    />
  );
}
