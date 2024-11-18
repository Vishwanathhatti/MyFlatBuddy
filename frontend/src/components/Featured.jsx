import React from 'react'
import room from "../assets/room.jpg"
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import FeaturedCard from './cards/FeaturedCard'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import 'swiper/css';

const Featured = () => {
    return (
        <div className='w-full flex flex-col px-5 my-10 overflow-hidden'>
            <h1 className='text-xl text-left font-medium text-slate-700'>Recent Posts</h1>
            <div className='flex w-full mx-auto flex-wrap my-3 items-center justify-center gap-6'>

                <Swiper
                    modules={[Pagination]}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 40,
                        },
                        1290: {
                          slidesPerView: 3,
                          spaceBetween: 50,
                        },
                      }}
                    loop={true}
                    className='mySwiper'
                >
                    <SwiperSlide className='mb-12 mt-4'><FeaturedCard /></SwiperSlide>
                    <SwiperSlide className='mb-12 mt-4'><FeaturedCard /></SwiperSlide>
                    <SwiperSlide className='mb-12 mt-4'><FeaturedCard /></SwiperSlide>
                    <SwiperSlide className='mb-12 mt-4'><FeaturedCard /></SwiperSlide>


                </Swiper>
                


            </div>
        </div >
    )
}

export default Featured