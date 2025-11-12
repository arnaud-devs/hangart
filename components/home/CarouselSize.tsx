import * as React from "react"

import { Card, CardContent } from "~/components/ui/card"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"

const images=[
  {
    id:1,
    src:'/assets/images/sample1.jpg',
  },
  {
    id:2,
    src:'/assets/images/sample2.jpg',
  },
  {
    id:3,
    src:'/assets/images/sample3.jpg',
  },
   {
    id:4,
    src:'/assets/images/sample4.jpg',
  }
]

export function CarouselSize() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [index, setIndex] = React.useState(0)
  const [count, setCount] = React.useState(1)

  React.useEffect(() => {
    if (!api) return
    const handler = () => {
      try {
        const sel = api.selectedScrollSnap()
        const snaps = api.scrollSnapList()
        setIndex(sel ?? 0)
        setCount(snaps.length || 1)
      } catch (e) {
        // ignore
      }
    }

    handler()
    api.on("select", handler)
    api.on("reInit", handler)

    return () => {
      api.off("select", handler)
      api.off("reInit", handler)
    }
  }, [api])

  const progress = Math.round(((index + 1) / Math.max(count, 1)) * 100)

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      setApi={setApi}
      className="w-full"
    >
      <div className="relative w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-0">
                <Card className="rounded-2xl overflow-hidden shadow-lg h-[50vh] p-0 border-0">
                  <CardContent className="flex aspect-1/4 md:aspect-square items-center justify-center h-full p-0">
                    <img
                      src={image.src}
                      alt={`Image ${image.id}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Position previous/next near bottom corners */}
        <CarouselPrevious className="top-auto -bottom-10 left-6 translate-y-0 bg-white border-0" />
        <CarouselNext className="top-auto -bottom-10 right-6 translate-y-0 bg-white border-0" />

        {/* Bottom progress and index */}
        <div className="pointer-events-none absolute left-0 right-0 -bottom-10 flex items-center justify-center">
          <div className="w-3/5 max-w-2xl flex items-center gap-6">
            <div className="flex-1 h-px bg-white/40 rounded">
              <div
                className="h-px bg-white rounded"
                style={{ width: `${progress}%` }}
                aria-hidden
              />
            </div>
            <div className="text-white text-xl font-medium ml-4">{String(index + 1).padStart(2, "0")}</div>
          </div>
        </div>
      </div>
    </Carousel>
  )
}
