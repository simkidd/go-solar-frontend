import { Metadata } from 'next';
import React from 'react'

const pageTitle = "Our Projects";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ProjectsPage = () => {
  return (
    <div>ProjectsPage</div>
  )
}

export default ProjectsPage