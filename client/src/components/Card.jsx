const Card = ({ image, name, price }) => {
    return ( 
        <div className="p-4 rounded-lg shadow-sm h-72 w-96 bg-slate cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <div className="hover:blur-xs hover:transition hover:duration-300">
                <img src={`http://localhost:8000/images/${image}`} alt={name} className="w-full h-auto rounded-md mb-4"/>
            </div>
            <div className="flex flex-col items-start">
                <h2 className="text-lg font-bold">{name}</h2>
                <p className="text-gray-500 text-sm">${price}</p>
            </div>
        </div>
     );
}
 
export default Card;