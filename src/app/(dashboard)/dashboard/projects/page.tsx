import type { Metadata } from "next";
import ProjectsTable from "../../components/projects/ProjectsTable";

export const metadata: Metadata = {
  title: "Installation Projects Portfolio | GoSolar Admin",
  description: "Manage completed solar installation case studies and portfolio.",
};

const ProjectsAdminPage = () => {
  return (
    <div className="w-full">
      <ProjectsTable />
    </div>
  );
};

export default ProjectsAdminPage;
