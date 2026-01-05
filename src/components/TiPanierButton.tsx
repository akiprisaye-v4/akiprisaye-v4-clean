import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useTiPanier } from "../hooks/useTiPanier";
import TiPanierDrawer from "./TiPanierDrawer";

/**
 * Ti‑panier button (mobile-first floating + optional header placement).
 * - Shows counter
 * - Opens TiPanierDrawer
 * - Supports both 'comparison' and 'wishlist' types
 */
export default function TiPanierButton({ float = true, type = 'comparison' }: { float?: boolean; type?: 'comparison' | 'wishlist' }) {
  const { count } = useTiPanier(type);
  const [open, setOpen] = useState(false);

  const Icon = type === 'wishlist' ? Heart : ShoppingCart;
  const label = type === 'wishlist' 
    ? (count > 0 ? `Ma liste — ${count} éléments` : "Ma liste vide")
    : (count > 0 ? `Ti‑panier — ${count} éléments` : "Ti‑panier vide");

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setOpen(true)}
        className={
          float
            ? `flex items-center gap-2 px-3 py-2 ${type === 'wishlist' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-${type === 'wishlist' ? 'pink' : 'blue'}-400`
            : `inline-flex items-center gap-2 px-3 py-2 ${type === 'wishlist' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-${type === 'wishlist' ? 'pink' : 'blue'}-400`
        }
      >
        <Icon size={18} aria-hidden />
        <span className="sr-only">{label}</span>
        <span aria-hidden className="font-medium">{count}</span>
      </button>

      <TiPanierDrawer open={open} onClose={() => setOpen(false)} type={type} />
    </>
  );
}
