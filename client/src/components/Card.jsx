const Card = ({ image, name, description, price }) => {
    return ( 
        <div className="p-4 rounded-lg shadow-sm h-[350px] w-96 bg-slate cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <div className="hover:blur-xs hover:transition hover:duration-300">
                <img src={`http://localhost:8000/images/${image}`} alt={name} className="w-full h-auto rounded-md mb-4"/>
            </div>
            <div className="flex flex-col items-start">
                <h2 className="text-lg font-bold py-0.5">{name}</h2>
                <p className="text-gray-500">{description}</p>
                <p className="text-lg font-semibold pt-5">${price} <span className="text-gray-500 text-xs">PKR</span></p>
            </div>
        </div>
     );
}
 
export default Card;