import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-red-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
        {/* Cột 1: Logo + mô tả */}
        Tất cả chỉ là za zoi
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        © {new Date().getFullYear()} Zycute. All rights reserved.
      </div>`
    </footer>
  );
};

export default Footer;
