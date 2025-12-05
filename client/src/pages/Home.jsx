import Card from "../components/Card";
import { useFetch } from "../hooks/useFetch";

const Home = () => {
    const url = "http://localhost:8000/api/product";
    const { data, loading, error } = useFetch(url);

    return ( 
        <div>
            <h1 className="text-2xl font-bold mb-6">Product List</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <div className="grid grid-cols-3 gap-6">
                {data && data.map((product) => (
                    <Card 
                        key={product._id}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
     );
}
 
export default Home;