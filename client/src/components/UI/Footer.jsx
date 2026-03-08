import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

export default function Footer() {
	return (
		<footer className="bg-gray-950 text-gray-400">
			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid md:grid-cols-4 gap-10">
					{/* Brand */}
					<div>
						<Link
							className="flex items-center cursor-pointer"
							to="/"
						>
							<img
								src={getImageUrl("brand.png")}
								alt="skyfer cloud storage app"
								className="w-25"
							/>
							<span className="text-3xl font-extrabold -ml-5 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary font-lobster select-none">
								Skyfer
							</span>
						</Link>

						<p className="mt-4 text-sm">
							Secure cloud storage built for developers and teams.
							Fast, encrypted and scalable.
						</p>

						<div className="flex gap-4 mt-6 text-lg">
							<a className="hover:text-white transition">
								<FaGithub />
							</a>
							<a className="hover:text-white transition">
								<FaTwitter />
							</a>
							<a className="hover:text-white transition">
								<FaLinkedin />
							</a>
							<a className="hover:text-white transition">
								<FaDiscord />
							</a>
						</div>
					</div>

					{/* Product */}
					<div>
						<h3 className="text-white font-semibold mb-4">
							Product
						</h3>

						<ul className="space-y-3 text-sm">
							<li className="hover:text-white cursor-pointer">
								Features
							</li>
							<li className="hover:text-white cursor-pointer">
								Security
							</li>
							<li className="hover:text-white cursor-pointer">
								Pricing
							</li>
							<li className="hover:text-white cursor-pointer">
								Integrations
							</li>
						</ul>
					</div>

					{/* Company */}
					<div>
						<h3 className="text-white font-semibold mb-4">
							Company
						</h3>

						<ul className="space-y-3 text-sm">
							<li className="hover:text-white cursor-pointer">
								About
							</li>
							<li className="hover:text-white cursor-pointer">
								Blog
							</li>
							<li className="hover:text-white cursor-pointer">
								Careers
							</li>
							<li className="hover:text-white cursor-pointer">
								Contact
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="text-white font-semibold mb-4">Legal</h3>

						<ul className="space-y-3 text-sm">
							<li className="hover:text-white cursor-pointer">
								Privacy Policy
							</li>
							<li className="hover:text-white cursor-pointer">
								Terms of Service
							</li>
							<li className="hover:text-white cursor-pointer">
								Cookies
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="border-t border-gray-800 mt-12 pt-6 text-sm text-center">
					© {new Date().getFullYear()} Skyfer. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
