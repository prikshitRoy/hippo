"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { useState } from "react";
import NavItem from "./NavItem";

const NavItems = () => {
  const [activeIndex, setActiveIdex] = useState<null | number>(null);
  const isAnyOpen = activeIndex !== null;

  return (
    <div className="flex gap-4 h-full">
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIdex(null);
          } else {
            setActiveIdex(i);
          }
        };

        const isOpen = i === activeIndex;

        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
          />
        );
      })}
    </div>
  );
};

export default NavItems;