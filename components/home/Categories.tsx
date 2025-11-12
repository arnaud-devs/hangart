// Paintings
// Sculpture
// Drawings
// Photographs
// Digital Art
// Prints 
import { Link } from "react-router"
const Categories = () => {
  return (
    <section>
        <ul className="flex w-full gap-7 py-4 lg:text-[24px] md:text-[20px] text-[16px] flex-wrap justify-center md:justify-end font-serif text-white px-[8%]">
            <li><Link to="/categories/paintings" className="  bg-white/8 text-white rounded-xl px-4 py-2">Paintings</Link></li>
            <li><Link to="/categories/sculpture" className=" bg-white/8 text-white rounded-xl px-4 py-2">Sculpture</Link></li>
            <li><Link to="/categories/drawings" className=" bg-white/8 text-white rounded-xl px-4 py-2">Drawings</Link></li>
            <li><Link to="/categories/photographs" className=" bg-white/8 text-white rounded-xl px-4 py-2">Photographs</Link></li>
            <li><Link to="/categories/digital-art" className=" bg-white/8 text-white rounded-xl px-4 py-2">Digital Art</Link></li>
            <li><Link to="/categories/prints" className=" bg-white/8 text-white rounded-xl px-4 py-2">Prints</Link></li>
        </ul>
    </section>
  )
}

export default Categories


