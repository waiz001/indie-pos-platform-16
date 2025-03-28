
import React from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Category } from "@/utils/data";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium">Categories</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/products">
            <Package className="mr-1 h-4 w-4" />
            Manage Products
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="transition-smooth hover-lift"
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
