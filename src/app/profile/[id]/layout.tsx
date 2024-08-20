import "./layout.scss";

interface Props {
  children: React.ReactNode;
  profile: React.ReactNode;
}

export default function Layout({ profile, children }: Props) {
  return (
    <>
      <title>Profile</title>
      <main className="profile-container">
        {profile}
        {children}
      </main>
    </>
  );
}
