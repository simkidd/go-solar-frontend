export const API_URL = process.env.API_URL;

export const getPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/posts`);

    const data = await res.json();
    const posts = data.posts;
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/posts/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);

    const data = await res.json();
    const products = data.products;
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/products/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
