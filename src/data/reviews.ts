interface IReview {
  name: string;
  content: string;
  role: string;
  image: string;
}

export const ReviewData: IReview[] = [
  {
    name: "Sarah Thompson",
    content:
      "I am extremely satisfied with the solar panel installation provided by GoSolar. The team was professional, efficient, and knowledgeable. Our energy bills have significantly decreased since going solar!",
    role: "Residential Customer",
    image: "",
  },
  {
    name: "John Smith",
    content:
      "We decided to switch to solar energy for our business, and GoSolar made the transition seamless. Their expertise and dedication to customer satisfaction were impressive.",
    role: "Business Owner",
    image: "",
  },
  {
    name: "Emily Davis",
    content:
      "Working with GoSolar was a fantastic experience. From the initial consultation to the installation, their team was professional and attentive to our needs. We are thrilled with our decision to switch to solar energy!",
    role: "Homeowner",
    image: "",
  },
];
