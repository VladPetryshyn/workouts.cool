import { ArticleDocument } from "@/models/Articles";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import "./styles.scss";

export const ArticleCard: FC<ArticleDocument> = ({ _id, title, content }) => {
  return (
    <div className="article-card">
      <div className="article-card-text">
        <Link href={`/article/${_id}`}>
          <h1 className="article-card-text-title">{title}</h1>
        </Link>
        <p className="article-card-text-description">{content}</p>
      </div>
      <div className="article-card-interact">
        <Link className="article-card-interact-view" href="#">
          view article
          <Image width={20} height={20} src="/arrow-right.svg" />
        </Link>
      </div>
    </div>
  );
};
