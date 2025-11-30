"use client";
import React, { useMemo, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import { menuData, type MenuItem } from "@/features/menu/mockMenu";
import { Button } from "@repo/ui";

export default function MenuList() {
  const [category, setCategory] = useState<string | null>(null);
  const [filterVeg, setFilterVeg] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [filterLowSugar, setFilterLowSugar] = useState(false);
  const [filterBestseller, setFilterBestseller] = useState(false);

  const categories = useMemo(() => Array.from(new Set(menuData.map((m) => m.category))), []);
  const tags = useMemo(() => Array.from(new Set(menuData.flatMap((m) => m.tags ?? []))), []);
  const filtered = useMemo(() =>
    menuData.filter((m) => {
      if (category && m.category !== category) return false;
      if (filterVeg && !m.tags?.includes('chay')) return false;
      if (filterSpicy && !m.tags?.includes('spicy')) return false;
      if (filterLowSugar && !m.tags?.includes('low-sugar')) return false;
      if (filterBestseller && !m.tags?.includes('bestseller')) return false;
      if (tagFilter && !m.tags?.includes(tagFilter)) return false;
      return true;
    }),
    [category, filterVeg, tagFilter, filterSpicy, filterLowSugar, filterBestseller]
  );

  const handleAdd = (id: string) => {
    console.log('Add', id);
  };

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <Button variant={category === null ? 'primary' : 'ghost'} size="sm" onClick={() => setCategory(null)}>Tất cả</Button>
            {categories.map((c) => (
              <Button key={c} variant={category === c ? 'primary' : 'ghost'} size="sm" onClick={() => setCategory(c)}>{c}</Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filterVeg} onChange={(e) => setFilterVeg(e.target.checked)} className="w-4 h-4"/> Chay</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filterSpicy} onChange={(e) => setFilterSpicy(e.target.checked)} className="w-4 h-4"/> Cay</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filterLowSugar} onChange={(e) => setFilterLowSugar(e.target.checked)} className="w-4 h-4"/> Ít đường</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filterBestseller} onChange={(e) => setFilterBestseller(e.target.checked)} className="w-4 h-4"/> Best seller</label>
          </div>
        </div>

        <div className="mb-4 flex gap-2 items-center">
          <span className="text-sm text-gray-600">Bộ lọc: </span>
          <Button variant={tagFilter === null ? 'ghost' : 'outline'} size="sm" onClick={() => setTagFilter(null)}>Tất cả</Button>
          {tags.map((t) => (
            <Button key={t} variant={tagFilter === t ? 'primary' : 'ghost'} size="sm" onClick={() => setTagFilter(tagFilter === t ? null : t)}>{t}</Button>
          ))}
        </div>

        {categories.map((cat) => {
          const items = filtered.filter((m) => m.category === cat);
          if (category && category !== cat) return null; // if we filtered by category, only show it
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-6">
              <h3 className="text-xl font-semibold mb-4">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleAdd} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
