import ProfileDetails from "../../components/ProfileDetails";

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
        Account Overview
      </h1>
      <ProfileDetails />
    </div>
  );
};

export default ProfilePage;
