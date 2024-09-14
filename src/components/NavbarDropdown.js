"use client";
import { useState } from 'react';
import Link from 'next/link';

const NavbarDropdown = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="cursor-pointer">{title}</span>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md shadow-lg z-50">
          <ul className="py-2">
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavbarDropdown;
