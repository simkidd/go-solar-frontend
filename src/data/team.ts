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

export interface TeamMember {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
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

export const TeamQuotes: TeamMember[] = [
  {
    name: "John Doe",
    role: "CEO",
    quote:
      "Our team is dedicated to revolutionizing the renewable energy industry and making a positive impact on the environment.",
    imageUrl: "",
  },
  {
    name: "Jane Smith",
    role: "COO",
    quote:
      "At our core, we believe in the power of solar energy to create a sustainable future for generations to come.",
    imageUrl: "",
  },
  {
    name: "David Johnson",
    role: "CTO",
    quote:
      "We are committed to providing innovative solar solutions that empower individuals and businesses to thrive.",
    imageUrl: "",
  },
];
