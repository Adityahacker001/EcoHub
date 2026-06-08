'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setIsSearched(true);
      // Perform search logic here
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Universal Search</h1>
        
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search for directives, annual reports, national recognitions..."
            className="w-full pl-10 pr-28 py-6 text-lg rounded-full shadow-md focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Button 
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-2"
          >
            Search
          </Button>
        </div>

        <div className="text-center">
          {!isSearched ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Search className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Your search results will appear here.
              </p>
              <p className="text-gray-400 text-sm">
                Use the search bar above to find anything across the platform.
              </p>
            </div>
          ) : (
            <div>
              {/* Search results will be displayed here */}
              <p>Searched for: "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
