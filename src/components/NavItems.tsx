"use client";

import { useState } from "react";

const NavItems = () => {
  const [activeIndex, setActiveIdex] = useState<null | number>(null);

  return <div className="flex gap-4 h-full">NavItem component</div>;
};

export default NavItems;
