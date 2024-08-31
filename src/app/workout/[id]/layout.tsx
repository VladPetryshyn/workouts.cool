import { ReactNode } from "react";
import "./layout.scss";

export default function Layout({ children }: {children: ReactNode}) {
  return <div className="body">{children}</div>;
}
