import Image from "next/image";
import Link from "next/link";
import "./styles.scss";

interface Props {
  profileId: string;
  username: string;
  className?: string;
  image?: string;
}

export const ProfileInfo = ({ profileId, username, image }: Props) => {
  const profileUrl = `/profile/${profileId}`;
  // const t = useTranslations("Header");

  return (
    <Link href={profileUrl} className="header-nav-profile">
      <Image
        width={60}
        height={60}
        src={image || "/user.svg"}
        alt={"profilePicture"}
      />
      <div className="header-nav-profile-text">
        <h3>{username}</h3>
        <p>
          <span>view profile</span>
          <Image
            width={18}
            height={18}
            src="/arrow-right.svg"
            alt="arrow right"
          />
        </p>
      </div>
    </Link>
  );
};
