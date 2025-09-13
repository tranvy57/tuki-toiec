import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-red-50 border-t border-gray-200 mt-12">
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        © {new Date().getFullYear()} Zycute. All rights reserved.
      </div>`
    </footer>
  );
};

export default Footer;
