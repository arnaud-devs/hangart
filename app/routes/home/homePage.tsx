import NavBar from "components/home/NavBar"
import Categories from "components/home/Categories"
import { Button } from "~/components/ui/button"
import { CarouselSize } from "components/home/CarouselSize"
const homePage = () => {
  return (
    <div className="min-h-screen bg-[url('/assets/images/pexels-tiana-18128-2956395.jpg')] bg-cover bg-center">
      <NavBar />
      <Categories />

      {/* Connect with an artist */}
<div className="grid grid-cols-1 md:grid-cols-2 justify-center border gap-8 min-h-screen  md:h-[70vh] items-center">
    <section className="px-[8%] md:px-[15%] ">
        <div className="flex flex-col md:block">
       <div className=" flex flex-col gap-[34px] ">
         <p className="lg:text-[70px] md:text-[60px] text-[50px] font-serif text-white font-thin md:leading-[74px] text-center md:text-left ">Connect with an artist</p>
        <p className="text-[20px] font-serif text-white text-center md:text-left">every Artwork is made by hand and Tells story  </p>
       </div>
       <Button className="p-6 mt-4 "><p className="text-[22px] font-serif text-white text-center ">Shop with Us</p></Button>
        </div>

      </section>
      <div className="mx-auto w-[80%] justify-self-center mb-10 md:mb-0">
        <CarouselSize />
      </div>
</div>
    </div>
  )
}

export default homePage
