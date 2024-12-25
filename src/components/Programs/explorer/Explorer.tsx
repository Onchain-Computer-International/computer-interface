import React, { useEffect, useRef, useState, useContext } from 'react';
import { useAtom } from 'jotai';
import { explorerAtom } from './explorerAtom';
import { AuthContext } from '../../../Provider';

type SearchParams = {
  tokenAddress?: string;
  query?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
};

export default function Explorer() {
  const { socket } = useContext(AuthContext);
  const [holders, setHolders] = useAtom(explorerAtom);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    offset: 0,
    limit: 24,
    sortBy: 'balance',
    sortDir: 'DESC'
  });
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleSearchResults = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === 'holder-search-results') {
        if (response.data.success) {
          setHolders(response.data.holders);
          setTotal(response.data.total);
        } else {
          console.error('Search failed:', response.data.error);
        }
      }
    };

    socket.addEventListener('message', handleSearchResults);

    return () => {
      socket.removeEventListener('message', handleSearchResults);
    };
  }, [socket, setHolders]);

  const handleSearch = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'search-holders',
        searchParams: {
          ...searchParams,
          query: searchParams.query || '*'
        }
      }));
    }
  };

  const handleSort = (field: string) => {
    const newDir = searchParams.sortDir === 'ASC' ? 'DESC' : 'ASC';
    setSearchParams(prev => ({
      ...prev,
      sortBy: field,
      sortDir: newDir
    }));
  };

  useEffect(() => {
    handleSearch();
  }, [searchParams]);

  // Updated column definitions with more compact labels
  const columns = [
    { field: 'address', label: 'Addr', sortable: false },
    { field: 'balance', label: 'Bal', sortable: true },
    { field: 'txCount', label: 'Tx', sortable: true },
    { field: 'volumeSent', label: 'Sent', sortable: true },
    { field: 'volumeReceived', label: 'Recv', sortable: true },
    { field: 'holdingPeriod', label: 'Hold', sortable: true },
    { field: 'lastActiveBlock', label: 'Last', sortable: true }
  ];

  // Format value based on field type
  const formatValue = (field: string, value: any) => {
    if (!value && value !== 0) return '0';

    switch (field) {
      case 'balance':
      case 'volumeSent':
      case 'volumeReceived':
      case 'maxSentAmount':
      case 'maxReceivedAmount':
        const num = Number(value);
        // Compact number formatting
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toFixed(2);
      
      case 'txCount':
      case 'totalSentTx':
      case 'totalReceivedTx':
        const txNum = Number(value);
        if (txNum >= 1000) return `${(txNum / 1000).toFixed(1)}K`;
        return txNum.toString();
      
      case 'holdingPeriod':
        const blocks = Number(value);
        if (blocks >= 1e6) return `${(blocks / 1e6).toFixed(1)}M`;
        if (blocks >= 1e3) return `${(blocks / 1e3).toFixed(1)}K`;
        return blocks.toString();
      
      case 'lastActiveBlock':
      case 'firstActiveBlock':
        return `#${Number(value).toLocaleString()}`;
      
      case 'address':
        return `${value.slice(0, 4)}..${value.slice(-3)}`;
      
      default:
        return value;
    }
  };

  // Add tooltip content based on field
  const getTooltip = (field: string, value: any) => {
    if (!value && value !== 0) return null;

    switch (field) {
      case 'balance':
      case 'volumeSent':
      case 'volumeReceived':
      case 'maxSentAmount':
      case 'maxReceivedAmount':
        // Show full precision on hover
        return value.toString();
      
      case 'address':
        // Show full address on hover
        return value;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0055aa] text-[#ffffff] font-['Topaz'] text-sm">
      {/* Compact header */}
      <div className="flex justify-between items-center bg-[#ffffff] px-2 py-1 text-[#0055aa]">
        <h2 className="text-sm font-bold">Token Explorer</h2>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchParams.query}
            onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
            className="px-1 py-0.5 bg-[#ffffff] border border-[#0055aa] rounded text-xs w-32"
          />
          <button 
            onClick={handleSearch}
            className="px-1 py-0.5 bg-[#0055aa] text-white rounded hover:bg-[#004499] text-xs"
          >
            Search
          </button>
        </div>
      </div>

      {/* Compact table */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-1 py-0.5">
        {/* Header Row */}
        <div className="grid grid-cols-7 gap-2 font-bold mb-0.5 text-xs border-b border-[#ffffff33] pb-0.5">
          {columns.map(({ field, label, sortable }) => (
            <div
              key={field}
              onClick={() => sortable && handleSort(field)}
              className={`${
                sortable ? 'cursor-pointer hover:text-[#00ffff]' : ''
              } ${
                searchParams.sortBy === field ? 'text-[#00ffff]' : ''
              } flex items-center`}
            >
              {label}
              {sortable && searchParams.sortBy === field && (
                <span className="ml-0.5 text-[10px]">
                  {searchParams.sortDir === 'ASC' ? '↑' : '↓'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="space-y-0.5">
          {holders.map((holder) => (
            <div 
              key={holder.address} 
              className="grid grid-cols-7 gap-2 hover:bg-[#004499] px-0.5 py-0.5 text-xs rounded"
            >
              {columns.map(({ field }) => {
                const value = holder[field as keyof typeof holder];
                const tooltip = getTooltip(field, value);
                
                return (
                  <div 
                    key={`${holder.address}-${field}`} 
                    className="truncate"
                    title={tooltip || undefined}
                  >
                    {formatValue(field, value)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Compact Results Counter */}
        <div className="mt-2 text-xs text-[#ffffff99]">
          {holders.length} of {total} results
        </div>
      </div>
    </div>
  );
} 