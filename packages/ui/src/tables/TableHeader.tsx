import React from 'react';
import { Search, Filter, RotateCcw, X } from '../icons';

interface TableHeaderProps {
  title: string;
  description: string;
  searchTerm?: string;
  activeFiltersCount: number;
  onSearchClick: () => void;
  onFilterClick: () => void;
  onClearAll: () => void;
  onResetFilters: () => void;
  activeColorClass?: string; // e.g. 'bg-primary' or 'bg-lime-500'
  activeShadowClass?: string;
  activeBorderClass?: string;
  indicatorColorClass?: string; // e.g. 'bg-primary' or 'bg-lime-400'
  extraActions?: React.ReactNode;
}

export default function TableHeader({
  title,
  description,
  searchTerm,
  activeFiltersCount,
  onSearchClick,
  onFilterClick,
  onClearAll,
  onResetFilters,
  activeColorClass = 'bg-primary',
  activeShadowClass = 'shadow-primary/30',
  activeBorderClass = 'border-primary/40',
  indicatorColorClass = 'bg-primary',
  extraActions
}: TableHeaderProps) {
  return (
    <div className="pb-4 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1.5 h-6 ${indicatorColorClass} rounded-full`} />
          <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">{title}</h3>
        </div>
        <p className="text-sm font-medium text-gray-400 pl-3.5" style={{ wordSpacing: "1px" }}>
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button
          onClick={onSearchClick}
          className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group
                  ${searchTerm
              ? `${activeColorClass} text-white shadow-lg ${activeShadowClass} border-transparent`
              : 'bg-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 border-transparent'}`}
          title="Search"
        >
          <Search className={`w-5 h-5 ${searchTerm ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
        </button>

        {/* Filter Button */}
        {activeFiltersCount > 0 ? (
          <div className={`flex items-center gap-1 p-1 pr-2 ${activeColorClass} rounded-full shadow-lg ${activeShadowClass.replace('/30', '/20')} border ${activeBorderClass} animate-in fade-in zoom-in duration-200`}>
            <button
              onClick={onFilterClick}
              className="flex items-center gap-2 px-3 py-2.5 hover:bg-black/10 rounded-full transition-colors"
            >
              <Filter className="w-4 h-4 text-white fill-current" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
            </button>
            <button
              onClick={onResetFilters}
              className="p-1.5 hover:bg-black/10 text-white rounded-2xl transition-colors"
              title="Clear all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onFilterClick}
            className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5"
            title="Filter"
          >
            <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Extra Actions (Export, Create, etc.) */}
        {extraActions}

        {/* Clear All Button */}
        {(searchTerm || activeFiltersCount > 0) && (
          <button
            onClick={onClearAll}
            className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all ml-1 flex items-center justify-center"
            title="Clear All"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
