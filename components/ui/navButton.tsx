
"use client";

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
};

export function NavButton({ href, label }: Props) {
  return (
    <a
      href={href}
      onClick={() => {
        console.log("CLICKED:", label);
        console.log("URL:", href);
      }}
      style={{
        display: "inline-block",
        padding: "12px",
        color: "white",
        cursor: "pointer",
        position: "relative",
        zIndex: 9999,
      }}
    >
      {label}
    </a>
  );
}
