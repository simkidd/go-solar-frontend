export const getPosts = async () => {
  try {
    const res = await fetch("https://dummyjson.com/posts");

    const data = await res.json();
    const posts = data.posts;
    return posts;
  } catch (error) {
    console.log(error);
  }
};
