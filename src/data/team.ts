interface Socials {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface Team {
  name: string;
  image: string;
  role: string;
  socials: Socials;
}

export const TeamMember: Team[] = [
  {
    name: "Alex Angel",
    role: "Manager",
    image: "",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "John Smith",
    role: "Chief Officer",
    image: "",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "Mark Donald",
    role: "Event Manager",
    image: "",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "Julia Taylor",
    role: "Project Manager",
    image: "",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
];
