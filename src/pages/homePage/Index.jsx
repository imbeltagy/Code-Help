import { Stack } from "@mui/material";
import Post from "./Post";

const HomePage = () => {
  const posts = [
    {
      fullname: "Vegetarian Stir-Fry with Tofu",
      date: "May 8, 2018",
      media: null,
      body: "Whip up a quick and healthy vegetarian stir-fry featuring colorful veggies and tofu. It's a nutritious option for a busy weeknight dinner.",
      isLiked: true,
    },
    {
      fullname: "Shrimp and Chorizo Paella",
      date: "September 14, 2016",
      media: { title: "Paella dish", src: "/assets/card-img-1.jpg" },
      body: "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.",
      isLiked: false,
    },
    {
      fullname: "Grilled Salmon with Lemon-Herb Marinade",
      date: "February 22, 2017",
      media: { title: "Salmon dish", src: "/assets/card-img-2.jpg" },
      body: "Enjoy the rich flavors of grilled salmon with a zesty lemon-herb marinade. It's a delightful dish for a cozy dinner with loved ones.",
      isLiked: true,
    },
  ];

  return (
    <Stack pb={4} spacing={4}>
      {posts.map((post, i) => (
        <Post data={post} key={i} />
      ))}
    </Stack>
  );
};

export default HomePage;
