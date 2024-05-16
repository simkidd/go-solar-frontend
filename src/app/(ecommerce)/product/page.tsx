import ProductCard from "@/app/(ecommerce)/components/ProductCard";
import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getProducts } from "@/lib/data";
import Cta from "../components/Cta";
import { Slider } from "@nextui-org/react";

const ProductListPage = async () => {
  const products: Product[] = await getProducts();
  const categories: Category[] = await getCategories();

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-1">
              <div>
                <h4>Category</h4>
                <ul>
                  {categories.map((cat) => (
                    <li key={cat?._id}>{cat?.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Price</h4>
                <Slider
                  label="Price Range"
                  size="sm"
                  step={50}
                  minValue={0}
                  maxValue={4000000}
                  defaultValue={[100, 500]}
                  formatOptions={{ style: "currency", currency: "NGN" }}
                  className="max-w-md"
                />
              </div>
              <div>
                <h4>Brand</h4>
                <ul>
                  <li>Brand 1</li>
                  <li>Brand 2</li>
                  <li>Brand 3</li>
                </ul>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex px-4 py-2 items-center justify-between border mb-4 shadow text-sm">
                <p>{products.length} Items</p>

                <div>
                  <span>Sort By</span>
                  <select name="" id="">
                    <option value="">Name</option>
                    <option value="">Price</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product?._id} item={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;
