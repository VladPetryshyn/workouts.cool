"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import "./styles.scss";
import { isMobileDeviceClient } from "@/lib/user-agent-client";
import { CardDeleteButton } from "../delete/deleteArticle";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  content: string;
  isOwner: boolean;
  url: string;
  editURL?: string;
  workout?: boolean;
  onDelete?: () => void;
  id: any;
}

export const ArticleCard: FC<Props> = ({
  title,
  content,
  url,
  editURL,
  onDelete,
  isOwner,
  id,
  workout,
}) => {
  // const isOwner = userId === String(author);
  const isMobile = isMobileDeviceClient();
  const router = useRouter();
  // const router = useRouter();

  const afterDelete = onDelete ?? router.refresh;
  // router.refresh
  return (
    <div className="article-card">
      <div className="article-card-text">
        <div className="article-card-text-title">
          <Link href={url}>
            <h1>{title}</h1>
          </Link>
          {isOwner && (
            <>
              {!isMobile && editURL && (
                <Link href={editURL}>
                  <Image
                    height={25}
                    width={25}
                    src="/pencil.svg"
                    alt="Edit Icon"
                  />
                </Link>
              )}
              <CardDeleteButton
                id={id}
                title={title}
                size={25}
                onDelete={afterDelete}
                workout={workout}
              />
            </>
          )}
        </div>
        <p className="article-card-text-description">{content}</p>
      </div>
      <div className="article-card-interact">
        <Link className="article-card-interact-view" href={url}>
          view content
          <Image
            width={20}
            height={20}
            src="/arrow-right.svg"
            alt="Arrow Icon"
          />
        </Link>
      </div>
    </div>
  );
};
