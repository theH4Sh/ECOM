import Card from "../components/Card";
import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";

const Home = () => {
    const url = "http://localhost:8000/api/product";
    const { data, loading, error } = useFetch(url);

    return ( 
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Product List</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data && data.map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id}>
                        <Card
                            image={product.image}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                        />
                    </Link>
                ))}
            </div>
        </div>
     );
}
 
export default Home;