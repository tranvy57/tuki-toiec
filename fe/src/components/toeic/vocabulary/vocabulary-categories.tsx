"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VocabularyCategoriesProps } from "@/types/vocabulary";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  { id: '', name: 'All', count: 156 },
  { id: 'business', name: 'Business', count: 45 },
  { id: 'daily-life', name: 'Daily Life', count: 38 },
  { id: 'travel', name: 'Travel', count: 25 },
  { id: 'technology', name: 'Technology', count: 22 },
  { id: 'food', name: 'Food & Dining', count: 18 },
  { id: 'health', name: 'Health', count: 8 },
];

export function VocabularyCategories({
  selectedCategory,
  onCategorySelect
}: VocabularyCategoriesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Categories</h3>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={
                selectedCategory === category.id 
                  ? "bg-[#ff776f] hover:bg-[#e55a52]" 
                  : "hover:bg-[#ff776f]/10"
              }
              onClick={() => onCategorySelect(category.id)}
            >
              <span>{category.name}</span>
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
