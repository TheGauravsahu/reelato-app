import { Link } from "react-router-dom";
import { Home, Upload, User } from "lucide-react";

const Navbar = () => {
  const items = [
    { name: "Home", href: "/", icon: Home },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Profile", href: "/settings/account", icon: User },
  ];
  return (
    <div
      className="bg-secondary rounded-full w-[80vw] h-12  fixed md:top-4 top-8 left-1/2 -translate-x-1/2
     text-foreground px-6 md:px-10 flex justify-between items-center z-10"
    >
      <div className="flex gap-1 items-center">
        <img
          src="/reelato-light.svg"
          className="h-4 w-4 md:h-6 md:w-6"
          alt="Reelato Logo"
        />
        <h1 className="text-center font-semibold text-md md:text-xl text-foreground">
          Reelato
        </h1>
      </div>

      <div className="flex w-[80%] gap-4 md:gap-8 justify-end">
        {items.map((item) => (
          <Link
            to={item.href}
            key={item.name}
            className="flex flex-row items-center justify-center gap-1 hover:text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm hidden md:block">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
