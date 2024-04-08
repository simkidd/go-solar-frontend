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

export const getPost = async (id: number) => {
  try {
    const res = await fetch(`https://dummyjson.com/posts/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products");

    const data = await res.json();
    const products = data.products;
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (id: number) => {
  try {
    const res = await fetch(`https://dummyjson.com/products/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
