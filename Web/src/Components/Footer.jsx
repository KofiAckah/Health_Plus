import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t border-secondary-200">
      <div className="container mx-auto px-4 py-4 text-center">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Health Plus. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
