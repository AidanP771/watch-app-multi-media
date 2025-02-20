import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface WatchCarouselProps {
  images: string[];
  name: string;
}

const WatchCarousel = ({ images, name }: WatchCarouselProps) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-80"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`${name} - View ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-accent px-3 py-1 text-white text-sm font-semibold rounded">Limited</span>
      </div>
    </div>
  );
};

export default WatchCarousel;