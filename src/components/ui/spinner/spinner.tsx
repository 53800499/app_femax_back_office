/** @format */

interface Props {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "white";
}

import clsx from "clsx";

export default function Spinner({
  size = "medium",
  variant = "primary"
}: Props) {
  let variantStyles: string, sizeStyles: string;

  switch (size) {
    case "medium":
      sizeStyles = "w-9 h-9";
      break;
    case "small":
      sizeStyles = "w-5 h-5";
      break;
    case "large":
      sizeStyles = "w-12 h-12";
      break;
  }

  switch (variant) {
    case "primary":
      variantStyles = "text-gray-600";
      break;
    case "white":
      variantStyles = "text-white";
      break;
  }

  return (
    <svg
      role="status"
      aria-label="Loading"
      className={clsx(variantStyles, sizeStyles, "animate-spin")}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H8c.942 3.042 4.135 5.824 6 7.938l-2-1.6z"></path>
    </svg>
  );
}
