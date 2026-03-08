import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const Navbar = () => {


	return (
		<div className="bg-white z-50 shadow-xs h-18">
			<div className=" flex justify-between h-full items-center container px-4">
				{/* brand name */}
				<Link className="flex items-center cursor-pointer" to="/">
					<img
						src={getImageUrl("brand.png")}
						alt="skyfer cloud storage app"
						className="w-25"
					/>
					<span className="text-3xl font-extrabold -ml-5 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary font-lobster select-none">
						Skyfer
					</span>
				</Link>

				{/* get started right section */}
				<div>
					<Link
						to="/login"
						className="bg-gray-900 text-white px-6 py-3 rounded-full cursor-pointer font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
					>
						Get Started
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
