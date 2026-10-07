

import Link from "next/link";
import Logo from "./logo";


export function HeaderLogo() {
  return (
    <div>
      <Link href="/">
        <div className="flex items-center gap-3">
          <Logo
            className="text-white"
            width={30}
            height={28}
          />

          <p className="font-extrabold text-white">
            Finance
          </p>
        </div>
      </Link>
    </div>
  );
}