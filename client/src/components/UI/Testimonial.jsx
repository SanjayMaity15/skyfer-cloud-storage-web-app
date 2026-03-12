import { Swiper, SwiperSlide } from "swiper/react";
import testimonialData from "../../utils/testtimonialData.json";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Rating from "./Rating";

export default function Testimonial() {
	return (
		<div className="max-w-7xl mx-auto relative py-16 px-4">
			<h3 className="text-center text-4xl font-semibold mb-6">
				Testimonial
			</h3>
			<div className="flex justify-between items-center gap-8">
				{/* Next Button */}
				<Swiper
					slidesPerView={3}
					spaceBetween={30}
					breakpoints={{
						320: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 2,
						},
						1024: {
							slidesPerView: 3,
						},
					}}
					modules={[Navigation]}
					navigation={{
						nextEl: ".testimonial-next",
						prevEl: ".testimonial-prev",
					}}
				>
					{testimonialData.map((data, index) => (
						<SwiperSlide key={index}>
							<div className="bg-white min-h-50 p-6 rounded-xl shadow">
								<div className="flex items-center gap-2">
									<img
										src={data.profilePic}
										className="w-12 h-12 rounded-full border"
									/>
									<h3 className="font-semibold">
										{data.name}
									</h3>
								</div>
								<p className="mt-2 text-sm text-gray-500">
									{data.message}
								</p>
								<Rating rating={data.rating} />
							</div>
						</SwiperSlide>
					))}
				</Swiper>
				
			</div>

			<div className="mt-6 flex justify-between px-6">
				{/* Prev Button */}
				<button className="testimonial-prev  bg-black text-white shadow px-4 py-2 rounded cursor-pointer ml-2">
					Prev
				</button>
				<button className="testimonial-next  bg-black text-white shadow px-4 py-2 rounded cursor-pointer ml-2">
					Next
				</button>

			</div>
		</div>
	);
}
