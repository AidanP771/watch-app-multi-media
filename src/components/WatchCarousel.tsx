import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface WatchCarouselProps {
  images: string[];
  name: string;
}

const WatchCarousel = ({ images, name }: WatchCarouselProps) => {
  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        pagination={{ 
          clickable: true,
          bulletActiveClass: 'bg-secondary',
          bulletClass: 'inline-block w-2 h-2 rounded-full bg-gray-dark mx-1 transition-colors cursor-pointer'
        }}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false
        }}
        loop={true}
        className="w-full aspect-square"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative">
              <img
                src={image}
                alt={`${name} - View ${index + 1}`}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-secondary/80 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-secondary/80 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Limited Edition Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-accent px-3 py-1 text-white text-sm font-semibold rounded">Limited</span>
      </div>
    </div>
  );
};

export default WatchCarousel;