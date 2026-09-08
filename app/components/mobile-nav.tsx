"use client";

import { useState } from "react";
import { Sheet } from "./ui/sheet";
import { IconButton } from "./ui/icon-button";
import { NavLinks } from "./nav-links";
import { MenuIcon } from "./icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton label="Buka menu navigasi" className="md:hidden" onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Sheet open={open} onClose={() => setOpen(false)} title="Navigasi">
        <NavLinks
          label="Navigasi"
          className="flex flex-col items-start gap-2"
          onNavigate={() => setOpen(false)}
        />
      </Sheet>
    </>
  );
}
